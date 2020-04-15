import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import FileReaderInput from 'react-file-reader-input';

const tipos = {
  publica: {
    accept: [
      // 'application/vnd.mophun.certificate',
      'application/x-x509-ca-cert',
      'application/pem-certificate-chain',
    ],
    defaultLabel: 'Seleccionar archivo .cer (Llave pública)',
  },

  privada: {
    accept: [
      // 'application/vnd.mophun.certificate',
      // 'application/pem-certificate-chain',
      'application/pkix-cert',
    ],
    defaultLabel: 'Seleccionar archivo .key (Llave privada)',
  },
};
function LlaveInput({
  tipo,
  constrasena,
  label,
  onChanged,
  onError,
  buttonProps,
  inputProps,
  children,
}) {
  const [{ fileName, content } = {}, setFile] = useState({});
  const { accept, defaultLabel } = tipos[tipo];

  const handleFile = (_, [[, file] = []] = []) => {
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onerror = onError;
    reader.onload = () => {
      setFile({
        fileName: file.name,
        content: reader.result,
      });
    };
  };

  useEffect(() => {
    if (content && fileName) {
      onChanged({ fileName, content });
    }
  }, [fileName, content, onChanged]);

  return (
    <FileReaderInput
      as="buffer"
      name="privateKeyInout"
      accept={accept.join(',')}
      {...inputProps}
      onChange={handleFile}
    >
      {children || (
        <Button variant="contained" component="span" {...buttonProps}>
          {label || defaultLabel}
        </Button>
      )}
    </FileReaderInput>
  );
}

LlaveInput.propTypes = {
  tipo: PropTypes.oneOf(Object.keys(tipos)),
  constrasena: PropTypes.string,
  inputProps: PropTypes.object,
  buttonProps: PropTypes.object,
  label: PropTypes.string,
  onChanged: PropTypes.func.isRequired,
  onError: PropTypes.func,
  children: PropTypes.element,
};

LlaveInput.defaultProps = {
  tipo: Object.keys(tipos)[0],
  onError: (err) => {
    console.error(err);
  },
};

export default LlaveInput;
