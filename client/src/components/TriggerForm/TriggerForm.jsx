import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './TriggerForm.module.css';
import WorkflowTriggerResultPopup from '../Popups/WorkflowTriggerResult/WorkflowTriggerResult.jsx';
import { api } from '../../api';

const TriggerForm = ({ definitionId }) => {
  const dispatch = useDispatch();
  const isOpened = useSelector(state => state.popup.isOpened);
  const workflowDefinitions = useSelector(state => state.workflows.workflowDefinitions);
  const [instanceName, setInstanceName] = useState('');
  const [signerName, setSignerName] = useState('');
  const [signerEmail, setSignerEmail] = useState('');
  const [ccName, setCcName] = useState('');
  const [ccEmail, setCcEmail] = useState('');
  const [isDataSending, setDataSending] = useState(false);
  const [workflowInstanceUrl, setWorkflowInstanceUrl] = useState('');

  const handleSubmit = async event => {
    event.preventDefault();

    // const body = {
    //   instanceName,
    //   signerEmail,
    //   signerName,
    //   ccEmail,
    //   ccName,
    // };

    const body = {
      instanceName: 'Contract for Rent 2024',
      signerEmail: 'anotherman@signer.com',
      signerName: 'Bob Swager',
      ccEmail: 'myemail@issuer.com',
      ccName: 'My Name (John Doe)',
    };

    setDataSending(true);
    const { data } = await api.workflows.triggerWorkflow(definitionId, body);
    setWorkflowInstanceUrl(data.workflowInstanceUrl);

    // Update workflowDefinitions. ...workflow creates new workflow-object to avoid mutation in redux
    const updatedWorkflowDefinitions = workflowDefinitions.map(workflow => {
      if (workflow.definitionId === definitionId) {
        return {
          ...workflow,
          instanceId: data.instanceId,
          isTriggered: true,
        };
      } else {
        return {
          ...workflow,
          instanceId: undefined,
          isTriggered: false,
        };
      }
    });

    dispatch({
      type: 'UPDATE_WORKFLOW_DEFINITIONS',
      payload: { workflowDefinitions: updatedWorkflowDefinitions },
    });
    setDataSending(false);

    setInstanceName('');
    setSignerName('');
    setSignerEmail('');
    setCcName('');
    setCcEmail('');
    dispatch({ type: isOpened ? 'CLOSE_POPUP' : 'OPEN_POPUP' });
  };

  return (
    <div className={styles.formContainer}>
      <h2>Fill in details</h2>
      <div className={styles.divider} />
      <form className={styles.triggerForm} onSubmit={handleSubmit}>
        <h3>Participant Information</h3>
        <div>
          <label>Instance Name *</label>
          <input type="text" value={instanceName} onChange={e => setInstanceName(e.target.value)} required={true} />
        </div>

        <div>
          <label>Signer Name *</label>
          <input type="text" value={signerName} onChange={e => setSignerName(e.target.value)} required={true} />
        </div>

        <div>
          <label>Signer Email *</label>
          <input type="text" value={signerEmail} onChange={e => setSignerEmail(e.target.value)} required={true} />
        </div>

        <div>
          <label>CC Name *</label>
          <input type="text" value={ccName} onChange={e => setCcName(e.target.value)} required={true} />
        </div>

        <div>
          <label>CC Email *</label>
          <input type="text" value={ccEmail} onChange={e => setCcEmail(e.target.value)} required={true} />
        </div>

        <div className={styles.divider} />
        <button type="submit" disabled={isDataSending}>
          Continue
        </button>
      </form>
      {isOpened && <WorkflowTriggerResultPopup workflowInstanceUrl={workflowInstanceUrl} />}
    </div>
  );
};

export default TriggerForm;
