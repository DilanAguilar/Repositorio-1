/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, Fragment, useState } from 'react'
import { Button } from 'vtex.styleguide'

export const RefoundButton: FC<any> = ({ orderId, refundable, disabled }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpen = () => {
    setIsModalOpen(!isModalOpen)
  }

  return (
    <Fragment>
      <div className="mv3">
        {!refundable ? (
          <Button
            block
            disabled={disabled}
            variation="primary"
            href={`/account#/facturacion?orderReembolsos=${orderId}`}
            onClick={() => handleOpen()}
          >
            Solicitar Reembolso
          </Button>
        ) : (
          <Button
            block
            variation="tertiary"
            noUpperCase
            noWrap
            href={`/account#/facturacion?showRefund=${orderId}`}
            onClick={() => handleOpen()}
          >
            Ver Solicitud Reembolso
          </Button>
        )}
      </div>
    </Fragment>
  )
}

export default RefoundButton
