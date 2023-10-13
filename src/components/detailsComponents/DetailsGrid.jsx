import { capitalizeFirstLetter } from "../toUpperCase"


export const DetailsGrid = ({ diamond }) => {
  return (
    <div className="grid grid-cols-5 gap-4 mt-4">
      <div>
        <p className="text-dark-grey">
          Shape
        </p>
        <p>
          {capitalizeFirstLetter(diamond.shape)}
        </p>
      </div>
      <div>
        <p className="text-dark-grey">
          Cut
        </p>
        <p>
          {diamond.specifications.cut}
        </p>
      </div>
      <div>
        <p className="text-dark-grey">
          Measurements
        </p>
        <p> 
          {diamond.ratio_measurements.measurements.width} - {diamond.ratio_measurements.measurements.height} x {diamond.ratio_measurements.measurements.depth}
        </p>
      </div>
      <div>
        <p className="text-dark-grey">
          Crown Angle
        </p>
        <p>
          xxxx
        </p>
      </div>
      <div>
        <p className="text-dark-grey">
          Girdle
        </p>
        <p>
          xxxx
        </p>
      </div>
      
      <div>
        <p className="text-dark-grey"> 
          Carat
        </p>
        <p>
          {diamond.specifications.carat}
        </p>
      </div>
      <div>
        <p className="text-dark-grey">
          Polish
        </p>
        <p>
          {diamond.finish.polish.toUpperCase()}
        </p>
      </div>
      <div>
        <p className="text-dark-grey">
          Table
        </p>
        <p>
          {diamond.table_depth.table}
        </p>
      </div>
      <div>
        <p className="text-dark-grey">
          Crown Height
        </p>
        <p>
          xxxx
        </p>
      </div>
      <div>
        <p className="text-dark-grey">
          Culet
        </p>
        <p>
          xxxx
        </p>
      </div>

      <div>
        <p className="text-dark-grey">
          Colour
        </p>
        <p>
          {diamond.specifications.color}
        </p>
      </div>
      <div>
        <p className="text-dark-grey">
          Symmetry
        </p>
        <p>
          {diamond.finish.symmetry.toUpperCase()}
        </p>
      </div>
      <div>
        <p className="text-dark-grey">
          Depth
        </p>
        <p>
          {diamond.ratio_measurements.measurements.depth}
        </p>
      </div>
      <div>
        <p className="text-dark-grey">
          Pavilion Angle
        </p>
        <p> 
          xxxx
        </p>
      </div>
      <div>
        <p className="text-dark-grey">
          Canada Mark
        </p>
        <p>
          xxxx
        </p>
      </div>

      <div>
        <p className="text-dark-grey">
          Clarity
        </p>
        <p>
          {diamond.specifications.clarity}
        </p>
      </div>
      <div>
        <p className="text-dark-grey">
          Fluorescence
        </p>
        <p>
          {capitalizeFirstLetter(diamond.finish.fluorescence)}
        </p>
      </div>
      <div>
        <p className="text-dark-grey">
          Ratio
        </p>
        <p>
          {diamond.ratio_measurements.ratio}
        </p>
      </div>
      <div>
        <p className="text-dark-grey">
          Pavilion Depth
        </p>
        <p>
          xxxx
        </p>
      </div>
      <div>
        <p className="text-dark-grey">
          Forever Mark
        </p>
        <p>
          xxxx
        </p>
      </div>
    </div>
  )
}