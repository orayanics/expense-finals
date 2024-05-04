export default function ConditionalMessage({ condition, message }) {
  return (
    <>
        {condition && <div>{message}</div>}
    </>
  )
}
