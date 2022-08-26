/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable prettier/prettier */
import { Fragment } from 'react';
/* import PupilButton from './PupilButton'; */
import SolicitarFactura from './SolicitarFactura';
 import RefoundButton from './RefundButton'; 
import useFetch from './utils/useFetch'
/* import { useEffect, useState } from 'react'
import VerFacturaButton from './VerFacturaButton'; */

interface Response{
    data: any
    status:any
}


const MyOrdersWrapper = ({ orderId }: any) => {
    const { data, status }: any = useFetch(`/api/oms/user/orders/${orderId}`)
    const correo = data?.clientProfileData?.email
    /* const correo : string = data?.namespaces?.profile?.email.value; */
    const medioPago: string = data?.paymentData?.transactions[0].payments[0].paymentSystemName;
    const userProfileId = data?.clientProfileData?.userProfileId
    const email = data?.clientProfileData?.email
    let creationDate: string = data.creationDate + '';
    const days = Math.round((new Date().getTime() - new Date(creationDate).getTime()) / (1000 * 3600 * 24))
    let fecha : string  = creationDate.split('T')[0]
    const daysVisibility = 600

    const resp:Response = useFetch(`/api/dataentities/solicitudreembolso/search?_schema=v1&_fields=numeroPedido&_where=(cliente=${email} OR correo=${email})`)
   
    /* const solicitudesFacturas = useFetch( `/_v/solicitudesfacturas?querystring=${correo}`)  */
    const solicitudesFacturas = useFetch( `api/dataentities/facturacionvtable/search?_schema=schemafacturacion&_fields=clavePedido&_where=(cliente=${correo} OR correoElectronico=${correo})`)
    console.log(solicitudesFacturas, "FETCH DESDE MIS PEDIDOS FACTURAS");
    console.log(status, data, 'STATUUSS DESDE MIS PEDIDOS');
    console.log(resp, 'REEMBOLSOS MIS PEDIDOS');

    
    if (status != 'fetched') return null

    let statusValidos:  string[] = ['approve-payment','payment-approved', 'ready-for-handling','start-handling', 'handling', 'invoice', 'invoiced']
    let statusValidus:  string[] = ['payment-approved'] 
    let dataxx: string[] = data
    //console.log('IdPedidoooooo: ', orderId,'Status del pedido: ', data.status, ' - Validación: ', statusValidos.includes(data.status), ' - Condición:',  statusValidos.includes(data.status))
    if (days < daysVisibility && days >= 0 && statusValidos.includes(data.status)) 
        return <MyOrdersWrapperChild orderId={orderId} facturas={solicitudesFacturas.data} statusValidus={statusValidus} dataxx={dataxx} medioPago={medioPago} monto={data.value/100} creationDate={fecha} userProfileId={userProfileId} reembolso={resp.data} />

    return null
}

const MyOrdersWrapperChild = ({ orderId, userProfileId, facturas, statusValidus, dataxx, reembolso  }: any) => {
    const { data }: any = useFetch(`api/dataentities/CL/search?userId=${userProfileId}&_fields=matricula`)
    console.log('DATAAAAAAAAAAAAA******', data);
    //const perfilAlumno = typeof(data?.[0]?.perfilAlumno) === 'undefined' ? false : (data?.[0]?.perfilAlumno === null ? false : data?.[0]?.perfilAlumno )
    

    const isFacturas= (orderId:any, obj:any) =>{
      let facturasArray:any = []
      obj.map((item:any)=>{
           facturasArray.push(item.clavePedido)
      })
  
      let resp = facturasArray.includes(orderId)
      console.log('Response Facturas Array Mis Pedidos',facturasArray)
      return resp
  }


    const matricula = typeof(data?.[0]?.matricula) === 'undefined' || data?.[0]?.matricula === null || data?.[0]?.matricula === '' ? false : data?.[0]?.matricula
    //console.log('matricula', matricula) 

   const isRefundable = (orderId:any, obj:any) =>{
        let conjuntoSolicitudes:any = []
        obj.map((item:any)=>{
             conjuntoSolicitudes.push(item.numeroPedido)
        })
    
        let resp = conjuntoSolicitudes.includes(orderId)
        console.log('reso',conjuntoSolicitudes)
        return resp
    } 

    if (data?.length > 0){
        if (statusValidus.includes(dataxx.status)) 
        return  <div></div> 


        if (matricula == false ) 
            return <Fragment><SolicitarFactura orderId={orderId} facturas={isFacturas(orderId, facturas)}/><RefoundButton orderId={orderId} refundable={isRefundable(orderId, reembolso )}/></Fragment>

           /*  if (matricula !== false ) return  <Fragment><PupilButton></PupilButton></Fragment>   */       

             if (matricula !== false ) return  <Fragment><RefoundButton orderId={orderId} refundable={isRefundable}/><div className='mv2'>  En caso de requerir Factura, contactar a Tec Service (tecservices@servicios.tec.mx)</div></Fragment> 
          
            /*  if (matricula == true) return  <Fragment><SolicitarFactura orderId={orderId} facturas={isFacturas(orderId, facturas)}/></Fragment>  */
    }



    return null
}






export default MyOrdersWrapper


