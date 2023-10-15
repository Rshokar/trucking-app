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
import toast from "react-hot-toast";

const ContactContainer = styled(Container)`
  background-color: white;
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding-bottom: 5rem;
  width: 100vw;
`;

const InputBox = styled(Input)``;

const InputBoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 45%;
`;

const TextAreaBox = styled(TextareaAutosize)`
  width: 100%;
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
  "&:hover": {
    opacity: 0.75,
  },
});

const ButtonText = styled(Typography)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ErrorMsg = styled(ErrorMessage)({
  color: "red",
  fontSize: "10pt",
});

const Contact: React.FC = () => {
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

    toast.success("Succesfully submitted, we will contact you shortly.", {
      position: "bottom-center",
    });
  };
  return (
    <ContactContainer>
      <Typography variant="h4" textAlign="center" fontWeight="bold">
        Contact Us!
      </Typography>
      <Typography variant="subtitle2" fontWeight="bold">
        Get in touch and let us know how we can help.
      </Typography>

      <div style={{ width: "50vw" }}>
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
                marginBottom: "30px",
              }}
            >
              <InputBoxContainer>
                <Field
                  as={InputBox}
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Name"
                />
                <ErrorMsg name="name" component="div" className="error" />
              </InputBoxContainer>
              <InputBoxContainer>
                <Field
                  as={InputBox}
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                />
                <ErrorMsg name="email" component="div" className="error" />
              </InputBoxContainer>
            </div>
            <div style={{ marginBottom: "25px" }}>
              <Field
                as={TextAreaBox}
                id="message"
                name="message"
                placeholder="What can we help you with?"
              />
              <ErrorMsg name="message" component="div" className="error" />
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
      </div>
    </ContactContainer>
  );
};

export default Contact;
