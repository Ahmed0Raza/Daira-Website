import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { CircularProgress } from '@mui/material';
import { useEvent } from '../../service/eventService';

const UploadEventData = () => {
  const [loading, setLoading] = useState(false);
  const { uploadEvent } = useEvent();

  const handleSubmit = async (values) => {
    setLoading(true);
    const formData = new FormData();
    const tokenData = JSON.parse(localStorage.getItem('adminData'));
    const token = tokenData && tokenData.result;
    formData.append('eventDataFile', values.file);
    try {
      const response = await uploadEvent(values.file, token);
    } catch (error) {
      console.error('Error uploading event data:', error);
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object().shape({
    file: Yup.mixed()
      .required('Please select a CSV or XLSX file')
      .test('fileType', 'Only CSV or XLSX files are allowed', (value) => {
        return (
          value &&
          [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/csv',
          ].includes(value.type)
        );
      })
      .test('fileSize', 'File size must be less than 20 MB', (value) => {
        return value && value.size <= 20 * 1024 * 1024; // 20 MB
      }),
  });

  const FileInput = ({ field, form, ...props }) => {
    const handleChange = (event) => {
      form.setFieldValue(field.name, event.currentTarget.files[0]);
    };

    return <input {...props} type="file" onChange={handleChange} />;
  };

  const Wrapper = styled.div`
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
  `;

  const Title = styled.h1`
    font-size: 24px;
    color: #333;
    text-align: center;
    margin-bottom: 20px;
  `;

  const StyledForm = styled(Form)`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  `;

  const InputWrapper = styled.div`
    margin-bottom: 20px;
    width: 100%;
  `;

  const Label = styled.label`
    font-size: 18px;
    color: #333;
  `;

  const StyledField = styled(Field)`
    margin-top: 8px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 100%;
  `;

  const Error = styled(ErrorMessage)`
    color: red;
    font-size: 14px;
    margin-top: 4px;
  `;

  const SubmitButton = styled.button`
    background-color: #007bff;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 18px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #0056b3;
    }
  `;

  return (
    <Wrapper>
      <Title>Upload Event Data</Title>
      {loading ? (
        <CircularProgress />
      ) : (
        <Formik
          initialValues={{ file: null }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
            <StyledForm>
              <InputWrapper>
                <Label htmlFor="file">Select XLS or CSV file:</Label>
                <Field
                  component={FileInput}
                  id="file"
                  name="file"
                  accept=".xls,.xlsx,.csv"
                />
                <Error name="file" component="div" />
              </InputWrapper>
              <SubmitButton type="submit">Upload</SubmitButton>
            </StyledForm>
          )}
        </Formik>
      )}
    </Wrapper>
  );
};

export default UploadEventData;
