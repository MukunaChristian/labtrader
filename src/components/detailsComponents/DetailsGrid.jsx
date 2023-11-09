import { capitalizeFirstLetter } from "../toUpperCase"


export const DetailsGrid = ({ diamond }) => {
  return (
    <div className="grid grid-cols-5 gap-4 mt-4">
      <div>
        <p className="text-primary">
          Shape
        </p>
        <p className="text-text">
          {capitalizeFirstLetter(diamond.shape)}
        </p>
      </div>
      <div>
        <p className="text-primary">
          Cut
        </p>
        <p className="text-text">
          {diamond.specifications.cut}
        </p>
      </div>
      <div>
        <p className="text-primary">
          Measurements
        </p>
        <p className="text-text">
          {diamond.ratio_measurements.measurements.width} - {diamond.ratio_measurements.measurements.height} x {diamond.ratio_measurements.measurements.depth}
        </p>
      </div>
      <div>
        <p className="text-primary">
          Crown Angle
        </p>
        <p className="text-text">
          xxxx
        </p>
      </div>
      <div>
        <p className="text-primary">
          Girdle
        </p>
        <p className="text-text">
          xxxx
        </p>
      </div>
      
      <div>
        <p className="text-primary"> 
          Carat
        </p>
        <p className="text-text">
          {diamond.specifications.carat}
        </p>
      </div>
      <div>
        <p className="text-primary">
          Polish
        </p>
        <p className="text-text">
          {diamond.finish.polish.toUpperCase()}
        </p>
      </div>
      <div>
        <p className="text-primary">
          Table
        </p>
        <p className="text-text">
          {diamond.table_depth.table}
        </p>
      </div>
      <div>
        <p className="text-primary">
          Crown Height
        </p>
        <p className="text-text">
          xxxx
        </p>
      </div>
      <div>
        <p className="text-primary">
          Culet
        </p>
        <p className="text-text">
          xxxx
        </p>
      </div>

      <div>
        <p className="text-primary">
          Colour
        </p>
        <p className="text-text">
          {diamond.specifications.color}
        </p>
      </div>
      <div>
        <p className="text-primary">
          Symmetry
        </p>
        <p className="text-text">
          {diamond.finish.symmetry.toUpperCase()}
        </p>
      </div>
      <div>
        <p className="text-primary">
          Depth
        </p>
        <p className="text-text">
          {diamond.ratio_measurements.measurements.depth}
        </p>
      </div>
      <div>
        <p className="text-primary">
          Pavilion Angle
        </p>
        <p className="text-text">  
          xxxx
        </p>
      </div>
      <div>
        <p className="text-primary">
          Canada Mark
        </p>
        <p className="text-text">
          xxxx
        </p>
      </div>

      <div>
        <p className="text-primary">
          Clarity
        </p>
        <p className="text-text">
          {diamond.specifications.clarity}
        </p>
      </div>
      <div>
        <p className="text-primary">
          Fluorescence
        </p>
        <p className="text-text">
          {capitalizeFirstLetter(diamond.finish.fluorescence)}
        </p>
      </div>
      <div>
        <p className="text-primary">
          Ratio
        </p>
        <p className="text-text">
          {diamond.ratio_measurements.ratio}
        </p>
      </div>
      <div>
        <p className="text-primary">
          Pavilion Depth
        </p>
        <p className="text-text">
          xxxx
        </p>
      </div>
      <div>
        <p className="text-primary">
          Forever Mark
        </p>
        <p className="text-text">
          xxxx
        </p>
      </div>
    </div>
  )
}