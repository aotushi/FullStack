import EditContact from "./components/editContactContext/index";
import Modal from "../src/components/Modal";

// interface ContactModalProps {
//   onClose: () => void;
// }

function ContactModal(props: { onClose: () => void }) {
  const contactId = "234";

  return (
    <EditContact.Root contactId={contactId}>
      <Modal onClose={props.onClose} title={<EditContact.Title />} footer={<EditContact.SubmitButtons />}>
        <EditContact.FormInputs />
      </Modal>
    </EditContact.Root>
  );
}

export default ContactModal;
