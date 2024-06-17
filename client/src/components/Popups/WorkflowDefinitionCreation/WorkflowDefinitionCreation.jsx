import withPopup from '../../../hocs/withPopup/withPopup.jsx';
import { Link } from 'react-router-dom';
import { ROUTE } from '../../../constants.js';
import { api } from '../../../api';
import { useSelector } from 'react-redux';
import imgError from '../../../assets/img/workflow-trigger.svg';
import imgSuccess from '../../../assets/img/success.svg';
import styles from './WorkflowDefinitionCreation.module.css';

const WorkflowDefinitionCreation = ({ message, togglePopup }) => {
  const workflowCreated = useSelector(state => state.workflows.workflows[state.workflows.workflows.length - 1]);
  const errorMessage = useSelector(state => state.popup.errorMessage);
  const templateName = useSelector(state => state.popup.templateName);

  const handleDownloadPrerequisites = async () => {
    await api.workflows.downloadWorkflowPrerequisites(templateName);
  };

  const handleDownloadTemplate = async () => {
    await api.workflows.downloadWorkflowTemplate(templateName);
  };

  return (
    <div>
      {errorMessage && templateName ? (
        <div className={styles.popupContainer}>
          <img src={imgError} alt="" />
          <h2>Workflow creation was unsuccessful</h2>
          <p>{errorMessage}</p>
          <button onClick={handleDownloadTemplate}>Download Template</button>
        </div>
      ) : (
        <div className={styles.popupContainer}>
          <img src={imgSuccess} alt="" />
          <h2>{message}</h2>
          <p>To publish the workflow, proceed with the button below</p>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            to={
              workflowCreated
                ? `https://apps-d.docusign.com/send/workflows/${workflowCreated.workflowDefinitionId}/edit`
                : ROUTE.HOME
            }
          >
            <button onClick={togglePopup}>Publish the workflow</button>
          </Link>
        </div>)
      }
    </div>
  );
};

const WorkflowCreationPopup = withPopup(WorkflowDefinitionCreation);
export default WorkflowCreationPopup;