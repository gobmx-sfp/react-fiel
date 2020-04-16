import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  CircularProgress,
  FormLabel,
  FormControl,
  Button,
  TextField,
  makeStyles,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import LlaveInput from '../LlaveInput';
import useFirma from '../../hooks/useFirma';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
      boxShadow: '0 3px 5px 2px rgba(127, 127, 127, .3)',
      width: '260px',
      borderRadius: 10,
      padding: '30px 15px 30px 15px',
      border: 0,
      color: 'white',
      textAlign:'center',
      position: 'relative',
      height: '80px',
      display: 'inline',
    },
    '& .MuiAlert-root,.MuiButton-root': {
      margin: theme.spacing(1),
    },
  },
  formControl: {
    margin: theme.spacing(1),
    boxShadow: '0 3px 5px 2px rgba(127, 127, 127, .3)',
    width: '450px',
    borderRadius: 10,
    padding: '30px 15px 30px 15px',
    border: 1,
    color: 'white',
    textAlign:'center',
    position: 'relative',
    maxHeight: '300px',
  },
  button: {
    margin: theme.spacing(1),
    borderRadius: 10,
    boxShadow: '0 3px 5px 2px rgba(127, 127, 127, .3)',
    width: '145px',
    borderRadius: 10,
    padding: '30px 15px 30px 15px',
    border: 0,
    color: 'white',
    textAlign:'center',
    position: 'relative',
    height: '80px',
    display: 'inline',
  },
  mensajeFirma: {
    margin: theme.spacing(1),
    borderRadius: 10,
    boxShadow: '0 3px 5px 2px rgba(127, 127, 127, .3)',
    width: '450px',
    borderRadius: 10,
    padding: '30px 15px 30px 15px',
    border: 0,
    color: 'white',
    textAlign:'center',
    position: 'relative',
    height: '80px',
    display: 'inline',
  },
}));

function FielFirma({ cadena, proxyUrl, mostrarFirma, confidencial, onFirma }) {
  const classes = useStyles();
  const [contrasena, setContrasena] = useState('');
  const [typedContrasena, setTypedContrasena] = useState('');
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
    statusError,
    llaveError,
    firmaError,
  } = useFirma({
    llavePublica,
    llavePrivada,
    contrasena,
    cadena,
    confidencial,
    proxyUrl,
  });

  useEffect(() => {
    if (firma) {
      onFirma(firma);
    }
  }, [firma]);

  useEffect(() => {
    if (llaveError) {
      setTypedContrasena('');
    }
  }, [llaveError, setTypedContrasena]);

  return (
    <form className={classes.root}>
      <FormControl fullWidth className={classes.formControl}>
        <FormLabel>Certificado público</FormLabel>
        <LlaveInput
          tipo="publica"
          onChanged={setLlavePublicaFile}
          label={
            llavePublicaFileName
              ? llavePublicaFileName
              : 'Seleccionar archivo .cer'
          }
          buttonProps={{
            disabled: statusLoading,
          }}
        />
        {statusLoading && <CircularProgress />}
        {statusError && (
          <Alert severity="error">
            <AlertTitle>{llavePublicaFileName}</AlertTitle>
            {statusError.toString()}
          </Alert>
        )}
        {isValid ? (
          <Alert severity="success">
            <AlertTitle>{llavePublicaFileName}</AlertTitle>
            El certificado es válido y está vigente
          </Alert>
        ) : isRevoked ? (
          <Alert severity="warning">
            <AlertTitle>{llavePublicaFileName}</AlertTitle>
            Este certificado ya expiró o ha sido revocado
          </Alert>
        ) : isUnknown ? (
          <Alert severity="warning">
            <AlertTitle>{llavePublicaFileName}</AlertTitle>
            Este certificado no es reconocido por el SAT
          </Alert>
        ) : null}
      </FormControl>

      <FormControl fullWidth className={classes.formControl}>
        <FormLabel>Llave privada</FormLabel>
        <LlaveInput
          tipo="privada"
          onChanged={setLlavePrivadaFile}
          label={
            llavePrivadaFileName
              ? llavePrivadaFileName
              : 'Seleccionar archivo .key'
          }
          buttonProps={{ color: 'default' }}
        />
        {llavePrivadaFileName && <FormLabel> 
          
          <Alert severity="info">
            <AlertTitle>{llavePrivadaFileName} </AlertTitle>
            Cargado!
          </Alert>
          </FormLabel>}
      </FormControl>

      {llavePrivadaFileName && (
        <TextField
          label="Contraseña"
          name="contrasena"
          type="password"
          size="small"
          helperText="Contraseña de la llave privada"
          value={typedContrasena}
          onChange={(event) => setTypedContrasena(event.target.value)}
          required
          autoFocus
        />
      )}

      <div className={classes.button}>
        <Button
          variant="contained"
          disabled={!isValid || !llavePrivadaFileName || !typedContrasena}
          onClick={() => {
            setContrasena(typedContrasena);
          }}
        >
          Firmar
        </Button>
      </div>
      
      {llaveError && (
        <div className={classes.mensajeFirma}>
          <Alert severity="error">
            Llave privada inválida o contraseña incorrecta
          </Alert>
        </div>
      )}

      {mostrarFirma && firma && (
        <div className={classes.mensajeFirma}>
          <Alert severity="info">
            <AlertTitle>Firma</AlertTitle>
            <code>{firma}</code>
          </Alert>
        </div>
      )}

      {firmaError && (
        <div className={classes.mensajeFirma}>
          <Alert severity="error">
            <code>Error al firmar cadena: {firmaError}</code>
          </Alert>
        </div>
      )}
    </form>
  );
}

FielFirma.propTypes = {
  cadena: PropTypes.string,
  onFirma: PropTypes.func,
  confidencial: PropTypes.bool,
  mostrarFirma: PropTypes.bool,
  proxyUrl: PropTypes.string,
};

FielFirma.defaultProps = {
  onFirma: console.log,
  mostrarFirma: false,
  confidencial: false,
};

export default FielFirma;
