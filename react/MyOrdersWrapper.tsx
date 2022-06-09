/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable prettier/prettier */
import { Fragment } from 'react';
import SolicitarFactura from './SolicitarFactura';
import RefoundButton from './RefundButton';
import useFetch from './utils/useFetch'
/* import { useEffect, useState } from 'react'
import VerFacturaButton from './VerFacturaButton'; */

/* const [orderIdd, setOrderId] = useState(0); */
/* const [solicitudesFacturacion, setSolicitudesFacturacion] = useState<[]>([]); */
/* const [idSolicitudFactura, setIdSolicitudFactura] = useState<[]>([]);
const [openModalVerFactura, setOpenModalVerFactura] = useState<boolean>(false); */
const MyOrdersWrapper = ({ orderId }: any) => {
    const { data, status }: any = useFetch(`/api/oms/user/orders/${orderId}`)
    const correo = data?.clientProfileData?.email
    /* const correo : string = data?.namespaces?.profile?.email.value; */
    const medioPago: string = data?.paymentData?.transactions[0].payments[0].paymentSystemName;
    const userProfileId = data?.clientProfileData?.userProfileId
    let creationDate: string = data.creationDate + '';
    const days = Math.round((new Date().getTime() - new Date(creationDate).getTime()) / (1000 * 3600 * 24))
    let fecha : string  = creationDate.split('T')[0]
    const daysVisibility = 60

    const solicitudesFacturas = useFetch( `api/dataentities/facturacionvtable/search?_schema=schemafacturacion&_fields=clavePedido&_where=(cliente=${correo} OR correoElectronico=${correo})`)
    console.log(solicitudesFacturas, "FETCH DESDE MIS PEDIDOS FACTURAS");
    console.log(status, data, 'STATUUSS DESDE MIS PEDIDOS');

    
    if (status != 'fetched') return null

    let statusValidos:  string[] = ['approve-payment','payment-approved', 'ready-for-handling','start-handling', 'handling', 'invoice', 'invoiced']

    //console.log('IdPedidoooooo: ', orderId,'Status del pedido: ', data.status, ' - Validación: ', statusValidos.includes(data.status), ' - Condición:',  statusValidos.includes(data.status))
    if (days < daysVisibility && days >= 0 && statusValidos.includes(data.status)) 
        return <MyOrdersWrapperChild facturas={solicitudesFacturas.data} orderId={orderId} medioPago={medioPago} monto={data.value/100} correo={correo} creationDate={fecha} userProfileId={userProfileId} />

   /*  if (days < daysVisibility && days >= 0 && statusValidos.includes(data.status)) 
        return <MyOrdersWrapperChilds orderId={orderId} medioPago={medioPago} monto={data.value/100} creationDate={fecha} userProfileId={userProfileId} /> */

    return null
}

const MyOrdersWrapperChild = ({ orderId,  userProfileId, facturas }: any) => {
    const { data }: any = useFetch(`api/dataentities/CL/search?userId=${userProfileId}&_fields=matricula`)
    console.log('DATAAAAAAAAAAAAA******', data);
    //const perfilAlumno = typeof(data?.[0]?.perfilAlumno) === 'undefined' ? false : (data?.[0]?.perfilAlumno === null ? false : data?.[0]?.perfilAlumno )
    

    const isFacturas= (orderId:any, obj:any) =>{
      let conjuntoSolicitudes:any = []
      obj.map((item:any)=>{
           conjuntoSolicitudes.push(item.clavePedido)
      })
  
      let resp = conjuntoSolicitudes.includes(orderId)
      console.log('reso',conjuntoSolicitudes)
      return resp
  }


    const matricula = typeof(data?.[0]?.matricula) === 'undefined' || data?.[0]?.matricula === null || data?.[0]?.matricula === '' ? false : data?.[0]?.matricula
    //console.log('matricula', matricula) 




    if (data?.length > 0){
        if (matricula == false ) 
            return <Fragment><RefoundButton orderId={orderId}/><SolicitarFactura facturas={isFacturas(orderId, facturas)} orderId={orderId} /></Fragment> 
        
            if (matricula !== false ) return  <Fragment><RefoundButton orderId={orderId}/><div className='mv2'>  En caso de requerir Factura, contactar a Tec Service (tecservices@servicios.tec.mx)</div></Fragment>
        
             if (matricula == true) return  <div> En caso de requerir Factura, contactar a Tec Service (tecservices@servicios.tec.mx)</div>  
    }



    return null
}






export default MyOrdersWrapper


