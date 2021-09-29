import './global.css'

const RemoveCancelButton = () => {
  Array.from(document.getElementsByClassName(
    'vtex-my-orders-app-3-x-cancelBtn'
  ) as HTMLCollectionOf<HTMLElement>).map(e => e.remove())

  Array.from(document.querySelectorAll('li:nth-child(2)'))
    .filter((e: any) => e.textContent.includes('Solicitar'))
    .map(e => {
      e.remove()
    })

  return null
}

export default RemoveCancelButton