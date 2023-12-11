const nm = jest.createMockFromModule("nodemailer") as any;

const transport = {
  sendMail: jest.fn()
};

nm.createTransport = jest.fn(() => transport);

export default nm;