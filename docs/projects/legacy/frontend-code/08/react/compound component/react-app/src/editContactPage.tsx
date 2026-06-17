import EditContact from "./components/editContactContext/index";

function EditContactPage() {
  const contactId = '123'

  return (
    <div>
      <EditContact.Root contactId={contactId}>

        <div>
          <EditContact.Title />
          <EditContact.SubmitButtons/>
        </div>
        <div>
          <EditContact.FormInputs />
        </div>
      </EditContact.Root>
    </div>
  )
}

export default EditContactPage