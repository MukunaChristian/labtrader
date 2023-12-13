export const SaveResetButtons = ({
  saveButtonHandler,
  resetButtonHandler,
  saveButtonDisabled,
  resetButtonDisabled,
}) => {
  return (
    <div className="flex flex-row justify-end mt-8">
      <button
        className={`${resetButtonDisabled ? 'default-button-disabled' : 'default-button'} w-24 mr-4`}
        onClick={resetButtonHandler}
        disabled={resetButtonDisabled}
      >
        Reset
      </button>
      <button
        className={`${saveButtonDisabled ? 'default-button-disabled' : 'default-save-button'} w-24`}
        onClick={saveButtonHandler}
        disabled={saveButtonDisabled}
      >
        Save
      </button>
    </div>
  );
}