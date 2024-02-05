export const FieldGroups = ({ fieldGroups, fieldGroupName, selectedFieldGroup, onFieldGroupSelect }) => {
  return (
    <div className="flex">
    <div className="flex flex-wrap">
        {fieldGroups.map(fieldGroup => (
            typeof fieldGroup === 'object' ?
                (
                    <div 
                        key={fieldGroup.name} 
                        onClick={() => onFieldGroupSelect(fieldGroupName, fieldGroup.name)} 
                        className={`${fieldGroup.name.some(r => {return selectedFieldGroup.includes(r.toLowerCase())}) ? 'default-filter-active' : 'default-filter-button'}`}
                    >
                        {fieldGroup.display}
                    </div>
                ) 
            : 
                (
                    <div 
                        key={fieldGroup} 
                        onClick={() => onFieldGroupSelect(fieldGroupName, fieldGroup)} 
                        className={`${selectedFieldGroup.includes(fieldGroup.toLowerCase()) ? 'default-filter-active' : 'default-filter-button'}`}
                    >
                        {fieldGroup}
                    </div>
                )
        ))}
    </div>
</div>
  );
}

export const FancyColorFields = ({ selectedFieldGroup, onFieldGroupSelect }) => {
  const fancyType = ["fancy", "fancy light", "fancy vivid", "fancy intense", "fancy deep", "fancy dark"]

  return (
    <div className="flex">
      <div className="flex flex-wrap">
        {fancyType.map(fieldGroup => (
          <div key={fieldGroup} onClick={() => onFieldGroupSelect('fancyColor', fieldGroup)} className={`${selectedFieldGroup.includes(fieldGroup) ? 'default-filter-active' : 'default-filter-button'}`}>{fieldGroup}</div>
        ))}
      </div>
    </div>  
  );
}