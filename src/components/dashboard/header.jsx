export const Header = ({ title, results }) => {
  return (
    <div className="p-4">
      <p className="text-xl font-bold">{ title }</p>
      <p className="text-sm text-dark-grey font-semibold">{ results } results</p>
    </div>
  )
}
