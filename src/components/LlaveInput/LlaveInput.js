import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, makeStyles } from '@material-ui/core';
import FileReaderInput from 'react-file-reader-input';

const useStyles = makeStyles((theme) => ({
  button: {
    textDecoration: 'none',
    padding: '5px',
    fontWeight: 'bold',
    fontSize: '12px',
    color: '#ffffff',
    backgroundColor: '#9a2049',
    borderRadius: '6px',
    border: '2px solid #501026',
    padding: '10px',
    width:'95%',
    '&:hover': {
      backgroundColor: '#ffffff',
      color: '#501026',
    },
  },
}));

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
      'application/pkcs8',
      'application/pkix-cert',
    ],
    defaultLabel: 'Seleccionar archivo .key (Llave privada)',
  },
};
function LlaveInput({
  tipo,
  label,
  onChanged,
  onError,
  buttonProps,
  inputProps,
  children,
}) {

  const classes = useStyles();

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
        <Button variant="contained" component="span" {...buttonProps} className={classes.button}>
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
