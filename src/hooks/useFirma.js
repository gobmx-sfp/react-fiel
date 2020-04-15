import { useState, useEffect } from 'react';
import { verificarValidez, firmarCadena } from '@gobmx-sfp/firmafiel';

const useFirma = ({ llavePublica, llavePrivada, contrasena, cadena }) => {
  const [{ status, issuer }, setOcspStatus] = useState({});
  const [firma, setFirma] = useState();
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState();
  const [firmaError, setFirmaError] = useState();
  const [firmaLoading, setFirmaLoading] = useState(false);

  /* Verificar certificado con protocolo OCSP */
  useEffect(() => {
    if (llavePublica) {
      console.log('cabiando llave');
      setStatusError();
      setStatusLoading(true);
      setOcspStatus({});
      verificarValidez(llavePublica)
        .then(setOcspStatus)
        .catch((err) => {
          console.warn(err);
          setStatusError(new Error('Certificado inválido o ilegible'));
        })
        .finally(() => {
          setStatusLoading(false);
        });
    }
  }, [llavePublica]);

  /* Firmar cadena con certificado y llave privada */
  useEffect(() => {
    if (
      llavePublica &&
      llavePrivada &&
      contrasena &&
      cadena &&
      !statusLoading
    ) {
      setFirmaError();
      setFirma();
      setFirmaLoading(true);
      firmarCadena({
        llavePublica,
        llavePrivada,
        contrasena,
        cadena,
      })
        .then(setFirma)
        .catch((err) => {
          console.warn(err);
          setFirmaError(new Error(err));
        })
        .finally(() => {
          setFirmaLoading(false);
        });
    }
  }, [llavePublica, llavePrivada, contrasena, cadena, statusLoading]);

  // console.log(
  //   'loading',
  //   loading,
  //   'signing',
  //   signingResult,
  //   'validation',
  //   certificateStatus
  // );
  return {
    firma,
    status,
    isValid: status === 'good',
    isRevoked: status === 'revoked',
    isUnknown: status === 'unknown',
    issuer,
    statusLoading,
    statusError,
    firmaLoading,
    firmaError,
    loading: statusLoading || firmaLoading,
  };
};

export default useFirma;
