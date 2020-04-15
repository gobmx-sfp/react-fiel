import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CircularProgress } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import LlaveInput from '../LlaveInput';
import useFirma from '../../hooks/useFirma';

const Campo = styled.div`
  padding: 1em 3em;
`;

function FielFirma({ proxyUrl }) {
  const { contrasena, setContrasena } = useState();
  const [
    { fileName: llavePublicaFileName, content: llavePublica },
    setLlavePublicaFile,
  ] = useState({});
  const [
    { fileName: llavePrivadaFileName, content: llavePrivada },
    setLlavePrivadaFile,
  ] = useState({});
  const {
    firma,
    isValid,
    isRevoked,
    isUnknown,
    statusLoading,
    firmaLoading,
    statusError,
    firmaError,
  } = useFirma({
    llavePublica,
    llavePrivada,
    contrasena,
  });

  return (
    <>
      <Campo>
        <LlaveInput
          tipo="publica"
          onChanged={setLlavePublicaFile}
          label={
            llavePublicaFileName &&
            `${llavePublicaFileName}${!statusLoading && ' (Seleccionar otro)'}`
          }
          buttonProps={{ color: 'default', disabled: statusLoading }}
        />
        {/* {!loading && llavePublicaFile.fileName && (
          <Button>Seleccionar otro</Button>
        )} */}
        {statusLoading && <CircularProgress />}
        {statusError && (
          <Alert severity="success">
            <em>{llavePublicaFileName}: </em>
            {/* {statusError.toString()} */}
          </Alert>
        )}
        {isValid ? (
          <Alert severity="success">
            El certificado es válido y está vigente
          </Alert>
        ) : isRevoked ? (
          <Alert severity="warning">
            Este certificado expiró o ha sido revocado
          </Alert>
        ) : isUnknown ? (
          <Alert severity="warning">
            Este certificado expiró o ha sido revocado
          </Alert>
        ) : null}
      </Campo>

      <Campo>
        <LlaveInput
          tipo="privada"
          onChanged={setLlavePrivadaFile}
          label={
            llavePrivadaFileName &&
            `${llavePrivadaFileName}${!firmaLoading && ' (Seleccionar otro)'}`
          }
          buttonProps={{ color: 'default' }}
        />
        {firmaError && (
          <Alert severity="warning">
            <em>{llavePrivadaFileName}: </em>
            {firmaError.toString()}
          </Alert>
        )}
      </Campo>
    </>
  );
}

FielFirma.propTypes = {
  proxyUrl: PropTypes.string,
};

export default FielFirma;
