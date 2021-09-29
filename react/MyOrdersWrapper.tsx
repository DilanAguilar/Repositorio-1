/* eslint-disable prettier/prettier */
import InvoiceButton from './InvoiceButton'
import useFetch from './utils/useFetch'

const MyOrdersWrapper = ({ orderId }: any) => {
    const { data, status }: any = useFetch(`/api/oms/user/orders/${orderId}`)
    const userProfileId = data?.clientProfileData?.userProfileId
    let creationDate: string = data.creationDate + '';
    const days = Math.round((new Date().getTime() - new Date(creationDate).getTime()) / (1000 * 3600 * 24))
    let fecha : string  = creationDate.split('T')[0]
    const daysVisibility = 30

    //console.log(status)

    if (status != 'fetched') return null

    let statusValidos:  string[] = ['approve-payment','payment-approved', 'ready-for-handling','start-handling', 'handling', 'invoice', 'invoiced']

    //console.log('IdPedidoooooo: ', orderId,'Status del pedido: ', data.status, ' - Validación: ', statusValidos.includes(data.status), ' - Condición:',  statusValidos.includes(data.status))
    if (days < daysVisibility && days >= 0 && statusValidos.includes(data.status)) 
        return <MyOrdersWrapperChild orderId={orderId} monto={data.value/100} creationDate={fecha} userProfileId={userProfileId} />

    return null
}

const MyOrdersWrapperChild = ({ orderId, monto, creationDate, userProfileId }: any) => {
    const { data }: any = useFetch(`api/dataentities/CL/search?userId=${userProfileId}&_fields=matricula`)
    //console.log('DATAAAAAAAAAAAAA******', data)
    //const perfilAlumno = typeof(data?.[0]?.perfilAlumno) === 'undefined' ? false : (data?.[0]?.perfilAlumno === null ? false : data?.[0]?.perfilAlumno )
    
    const matricula = typeof(data?.[0]?.matricula) === 'undefined' || data?.[0]?.matricula === null || data?.[0]?.matricula === '' ? false : data?.[0]?.matricula
    //console.log('matricula', matricula) 

    if (data?.length > 0){
        if (matricula == false ) 
            return <InvoiceButton orderId={orderId} monto={monto} creationDate={creationDate}/>
    }
    return null
}

export default MyOrdersWrapper
