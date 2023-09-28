export const FieldGroups = ({ fieldGroups, fieldGroupName, selectedFieldGroup, onFieldGroupSelect }) => {
  return (
    <div className="flex">
      <div className="flex flex-wrap">
        {fieldGroups.map(fieldGroup => (
          <div key={fieldGroup} onClick={() => onFieldGroupSelect(fieldGroupName, fieldGroup)} className={`${selectedFieldGroup.includes(fieldGroup) ? 'default-filter-active' : 'default-filter-button'}`}>{fieldGroup}</div>
        ))}
      </div>
    </div>  
  );
}