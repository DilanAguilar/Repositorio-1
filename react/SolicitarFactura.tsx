/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, Fragment, useState } from 'react'
import { Button } from 'vtex.styleguide'

export const SolicitarFactura: FC<any> = ({ orderId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpen = () => {
    setIsModalOpen(!isModalOpen)
  }

  return (
    <Fragment>
      <div className="mv3">
        <Button
          block
          variation="secondary"
          href={`/account#/facturacion?orderFacturacion=${orderId}`}
          onClick={() => handleOpen()}
        >
          Solicitar Factura
        </Button>
      </div>
    </Fragment>
  )
}

export default SolicitarFactura
