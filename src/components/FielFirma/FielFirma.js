import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CircularProgress } from '@material-ui/core';
import LlaveInput from '../LlaveInput';
// import Firmafiel from '@gobmx-sfp/firmafiel';
import useFirma from '../../hooks/useFirma';

const Caja = styled.div``;

const ErrorCampo = styled.div`
  background: red;
  padding: 0.4em 2em;
  margin: 10px 0;
  color: white;
`;

const Campo = styled.div`
  padding: 1em 3em;
`;

// Components are functions, and they must start with a capital letter
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
    <Caja>
      <Campo>
        <LlaveInput
          tipo="publica"
          onChanged={setLlavePublicaFile}
          label={
            llavePublicaFileName &&
            `${llavePublicaFileName}${!statusLoading && ' (Seleccionar otro)'}`
          }
          buttonProps={{ color: 'success', disabled: statusLoading }}
        />
        {/* {!loading && llavePublicaFile.fileName && (
          <Button>Seleccionar otro</Button>
        )} */}
        {statusLoading && <CircularProgress />}
        {statusError && (
          <ErrorCampo>
            <em>{llavePublicaFileName}: </em>
            {statusError.toString()}
          </ErrorCampo>
        )}
        {isValid && <div>Certificado válido</div>}
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
          <ErrorCampo>
            <em>{llavePrivadaFileName}: </em>
            {firmaError.toString()}
          </ErrorCampo>
        )}
      </Campo>
    </Caja>
  );
}

FielFirma.propTypes = {
  proxyUrl: PropTypes.string,
};

export default FielFirma;
