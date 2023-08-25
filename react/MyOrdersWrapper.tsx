/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable prettier/prettier */
import { Fragment} from 'react';
import { Spinner, Alert } from 'vtex.styleguide';
/* import PupilButton from './PupilButton'; */
import SolicitarFactura from './SolicitarFactura';
 import RefoundButton from './RefundButton'; 
import useFetch from './utils/useFetch'
/* import { useEffect, useState } from 'react'
import VerFacturaButton from './VerFacturaButton'; */

interface Response{
    data: any
    status:any
    error: any
}


const MyOrdersWrapper = ({ orderId }: any) => {
    const { data, status, error }: Response = useFetch(`/api/oms/user/orders/${orderId}`)
    const medioPago: string = data?.paymentData?.transactions[0].payments[0].paymentSystemName;
    const userProfileId = data?.clientProfileData?.userProfileId
    const email = data?.clientProfileData?.email
    let creationDate: string = data.creationDate + '';
    const days = Math.round((new Date().getTime() - new Date(creationDate).getTime()) / (1000 * 3600 * 24))
    let fecha : string  = creationDate.split('T')[0]
    const daysVisibility = 30

    const { data: resp, status: statusResp, error: errorResp }: Response = useFetch(`/_v/solicitudesreembolsos?querystring=${email}`)
    const { data: solicitudesFacturas, status: statusSolicitudesFacturas, error: errorFacturas }: Response = useFetch(`/_v/solicitudesfacturas?querystring=${email}`)
    console.log(solicitudesFacturas, "FETCH DESDE MIS PEDIDOS FACTURAS");
    console.log(status, data, 'STATUUSS DESDE MIS PEDIDOS');
    console.log(resp, 'REEMBOLSOS MIS PEDIDOS');


    let isLoading = false;
    let hasError = false;

    if (status !== 'fetched') {
        isLoading = true;
    }
    if(statusSolicitudesFacturas !== 'fetched'){
        isLoading = true;
    }
    if(statusResp !== 'fetched'){
        isLoading = true;
    }
    if (error >= 400 || errorResp >= 400 || errorFacturas >= 400) {
        hasError = true;
    }
    
    let statusValidos:  string[] = ['approve-payment','payment-approved', 'ready-for-handling','start-handling', 'handling', 'invoice', 'invoiced']
    let statusValidus:  string[] = ['invoice', 'invoiced'] 
    let dataxx: string[] = data
    if (days < daysVisibility && days >= 0 && statusValidos.includes(data.status)) 
        return <Fragment>
            
            { isLoading ?  (
                <Spinner size={20} />
                ) : 
            hasError ? (
                <Alert type="error">Ha ocurrido un error de conexión, por favor recargue la página.</Alert>
            ) : (
               <MyOrdersWrapperChild 
               orderId={orderId} 
               facturas={solicitudesFacturas.data} 
               statusValidus={statusValidus} 
               dataxx={dataxx} 
               medioPago={medioPago} 
               monto={data.value/100} 
               creationDate={fecha} 
               userProfileId={userProfileId} 
               reembolso={resp.data} 
               />
               )
            }

               </Fragment>

    return null
}

const MyOrdersWrapperChild = ({ orderId, userProfileId, facturas, dataxx, reembolso, statusValidus  }: any) => {
    const { data}: any = useFetch(`/_v/masterInfo?userId=${userProfileId}`);
    console.log('DATAAAAAAAAAAAAA******', data);

    const isFacturas= (orderId:any, obj:any) =>{
      let facturasArray:any = []
      obj?.responseSpecSku?.data?.map((item:any)=>{
           facturasArray.push(item.clavePedido)
      })
  
      let resp = facturasArray.includes(orderId)
      console.log('Response Facturas Array Mis Pedidos',facturasArray)
      return resp
  }


    const matricula = typeof(data?.[0]?.matricula) === 'undefined' || data?.[0]?.matricula === null || data?.[0]?.matricula === '' ? false : data?.[0]?.matricula

   const isRefundable = (orderId:any, obj:any) =>{
        let conjuntoSolicitudes:any = []
        obj?.responseSpecSku?.data?.map((item:any)=>{
             conjuntoSolicitudes.push(item.numeroPedido)
        })
    
        let resp = conjuntoSolicitudes.includes(orderId)
        console.log('reso',conjuntoSolicitudes)
        return resp
    } 

    const isTuition = (sellers: any) =>{
        let aplica = false
        sellers.map((item:any) =>{
            if( item.id ===  "centroidiomastecqa" || item.id === "colegiaturatecqa" || item.id ==="prestamoeducativotecqa")
            aplica = true
        })
console.log("APLICA COLEGIATURA", aplica)
        return aplica
    }

    if (data?.length > 0){
        if (statusValidus.includes(dataxx.status)) 
        return  <div></div> 


        if (matricula == false ) 
            return <Fragment><SolicitarFactura orderId={orderId} facturas={isFacturas(orderId, facturas)}/><RefoundButton orderId={orderId} refundable={isRefundable(orderId, reembolso )} colegiatura={false} /></Fragment>

           /*  if (matricula !== false ) return  <Fragment><PupilButton></PupilButton></Fragment>   */       

             if (matricula !== false ) return  <Fragment><RefoundButton orderId={orderId} refundable={isRefundable} colegiatura={isTuition(dataxx.sellers)}  /><div className='mv2'>  En caso de requerir Factura, contactar a Tec Service (tecservices@servicios.tec.mx)</div></Fragment> 
          
            /*  if (matricula == true) return  <Fragment><SolicitarFactura orderId={orderId} facturas={isFacturas(orderId, facturas)}/></Fragment>  */
    }



    return null
}






export default MyOrdersWrapper


