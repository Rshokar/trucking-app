import React, { useState } from "react";
import styled from "styled-components";
import { Container } from "../../../components/shared";
import {
  Typography,
  Button,
  Input,
  TextareaAutosize,
  useTheme,
} from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

type Props = {};

const ContactContainer = styled(Container)`
  background-color: white;
  /* height: 75vh; */
  flex-direction: column;
  gap: 30px;
  padding-bottom: 5rem;
  width: "50vw";
`;

const InputBox = styled(Input)``;

const TextAreaBox = styled(TextareaAutosize)`
  border-top: none;
  border-left: none;
  border-right: none;
  padding-bottom: 5rem;
  &::placeholder {
    /* Define your placeholder styles here */
    font-size: 12pt;
    color: #7b7b7b; /* Placeholder text color */
    font-family: sans-serif;
  }
`;

const PrimaryButton = styled(Button)({
  width: "100%",
});

const ButtonText = styled(Typography)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Contact: React.FC = (props: Props) => {
  const theme = useTheme();
  const initialValues = {
    name: "",
    email: "",
    message: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    message: Yup.string().required("Message is required"),
  });

  const handleSubmit = (values: any, { resetForm }: any) => {
    // You can handle the form submission here (e.g., send the data to a server).
    // For now, let's log the form data to the console.
    console.log(values);
    resetForm();
  };
  return (
    <ContactContainer>
      <Typography variant="h4" textAlign="center" fontWeight="bold">
        Contact Us!
      </Typography>
      <Typography variant="subtitle2" fontWeight="bold">
        Get in touch and let us know how we can help.
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "space-between",

              width: "100%",
              marginBottom: "20px",
            }}
          >
            <Field
              as={InputBox}
              type="text"
              id="name"
              name="name"
              placeholder="Name"
            />
            <ErrorMessage name="name" component="div" className="error" />

            <Field
              as={InputBox}
              type="email"
              id="email"
              name="email"
              placeholder="Email"
            />
            <ErrorMessage name="email" component="div" className="error" />
          </div>
          <div style={{ marginBottom: "25px" }}>
            <Field
              as={TextAreaBox}
              id="message"
              name="message"
              placeholder="What can we help you with?"
              style={{ width: "100%" }}
            />
            <ErrorMessage name="message" component="div" className="error" />
          </div>

          <PrimaryButton
            type="submit"
            style={{ backgroundColor: theme.palette.primary.main }}
          >
            <ButtonText variant="button" color="white" fontWeight="bold">
              Submit
            </ButtonText>
          </PrimaryButton>
        </Form>
      </Formik>
    </ContactContainer>
  );
};

export default Contact;
