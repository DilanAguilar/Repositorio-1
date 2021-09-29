/* eslint-disable prettier/prettier */
import InvoiceButton from './InvoiceButton'
import useFetch from './utils/useFetch'
import { useOrder } from 'vtex.order-placed/OrderContext'

const OrderPlacedWrapper = () => {
  console.log('Orderplace - Invoice')
  const order = useOrder()
  const { data, status }: any = useFetch(
    `/api/oms/user/orders/${order?.orderId}`
  )
  
  const orderId = order?.orderId
  const creationDate: string = data.creationDate + '';
  const fecha : string  = creationDate.split('T')[0]
  const userProfileId = data?.clientProfileData?.userProfileId

  if (status != 'fetched') return null

  if (data.status == 'canceled') return null


  let statusValidos:  string[] = ['approve-payment','payment-approved', 'ready-for-handling','start-handling', 'handling', 'invoice', 'invoiced']

  console.log('Estatus pedido =>', data.status)

  if (statusValidos.includes(data.status)) 
    return <OrderPlacedWrapperChild orderId={orderId} monto={data.value/100} creationDate={fecha} userProfileId={userProfileId} />
  
    return null
}

const OrderPlacedWrapperChild = ({ orderId, monto, creationDate, userProfileId }: any) => {
    const { data }: any = useFetch(`/api/dataentities/CL/search?userId=${userProfileId}&_fields=perfilAlumno`)

    const perfilAlumno = typeof(data?.[0]?.perfilAlumno) === 'undefined' ? false : data?.[0]?.perfilAlumno 
    console.log('perfilAlumno', perfilAlumno)

    if (perfilAlumno == false) return <InvoiceButton orderId={orderId} monto={monto} creationDate={creationDate} />

    return null
}

export default OrderPlacedWrapper
