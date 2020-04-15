import { useState, useEffect } from 'react';
import {
  verificarValidez,
  firmarCadena,
  desencriptarLlavePrivada,
} from '@gobmx-sfp/firmafiel';

const useFirma = ({
  llavePublica,
  llavePrivada,
  contrasena,
  cadena,
  proxyUrl,
}) => {
  const [{ status, issuer }, setOcspStatus] = useState({});
  const [firma, setFirma] = useState();
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState();
  const [llaveError, setLlaveError] = useState();
  const [llavePrivadaDesencriptada, setLlavePrivadaDesencriptada] = useState();
  const [firmaError, setFirmaError] = useState();
  const [firmaLoading, setFirmaLoading] = useState(false);

  /* Verificar certificado con protocolo OCSP */
  useEffect(() => {
    if (llavePublica) {
      setStatusError();
      setStatusLoading(true);
      setOcspStatus({});
      verificarValidez(llavePublica, proxyUrl)
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

  useEffect(() => {
    if (llavePrivada && contrasena) {
      try {
        const llave = desencriptarLlavePrivada(llavePrivada, contrasena);
        setLlavePrivadaDesencriptada(llave);
        setLlaveError(llave ? null : new Error('Contraseña incorrecta'));
      } catch (err) {
        console.warn(err);
        setLlaveError(err);
      }
    }
  }, [llavePrivada, contrasena]);

  /* Firmar cadena con certificado y llave privada */
  useEffect(() => {
    if (llavePublica && llavePrivadaDesencriptada && cadena) {
      setFirmaError();
      setFirma();
      setFirmaLoading(true);
      firmarCadena({
        llavePublica,
        llavePrivadaDesencriptada,
        cadena,
      })
        .then(setFirma)
        .catch((err) => {
          console.warn(err);
          setFirmaError(err);
        })
        .finally(() => {
          setFirmaLoading(false);
        });
    }
  }, [llavePublica, llavePrivadaDesencriptada, cadena]);

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
    llaveError,
    loading: statusLoading || firmaLoading,
  };
};

export default useFirma;
