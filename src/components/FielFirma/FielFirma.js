import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
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
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
    '& .MuiAlert-root,.MuiButton-root': {
      margin: theme.spacing(1),
    },
  },
  formControl: {
    margin: theme.spacing(1),
  },
}));

function FielFirma({ cadena, proxyUrl }) {
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
    firmaLoading,
    statusError,
    llaveError,
    firmaError,
  } = useFirma({
    llavePublica,
    llavePrivada,
    contrasena,
    cadena,
    proxyUrl,
  });
  return (
    <form className={classes.root} noValidate autoComplete="off">
      <FormControl fullWidth className={classes.formControl}>
        <FormLabel>Certificado público</FormLabel>
        <LlaveInput
          tipo="publica"
          onChanged={setLlavePublicaFile}
          label={
            llavePublicaFileName
              ? 'Seleccionar otro'
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
            llavePublicaFileName
              ? 'Seleccionar otro'
              : 'Seleccionar archivo .key'
          }
          buttonProps={{ color: 'default' }}
        />
        {/* {firmaError && (
          <Alert severity="error">
            <em>{llavePrivadaFileName}: </em>
            {firmaError.toString()}
          </Alert>
        )} */}
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

      {llaveError && (
        <Alert severity="error">
          Llave privada inválida o contraseña incorrecta
        </Alert>
      )}

      <Button
        variant="contained"
        disabled={!isValid || !llavePrivadaFileName || !typedContrasena}
        onClick={() => {
          setContrasena(typedContrasena);
        }}
      >
        Firmar
      </Button>
    </form>
  );
}

FielFirma.propTypes = {
  cadena: PropTypes.string,
  proxyUrl: PropTypes.string,
};

export default FielFirma;
