import React from "react";
import styled, { injectGlobal } from "styled-components";

injectGlobal`
  html {
    height: 100%;
    width: 100%;
  }
  
  body {
    margin: 0;
    padding: 0;
    font-size: 16px;
    font-weight: 600;

    * {
      font-family: 'Montserrat', sans-serif;
    }
  }
`;

export const Layout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  background-color: ${({ theme }) => theme.color.bodyBg};

  width: 100%;
  min-height: 100vh;

  button {
    cursor: pointer;
  }
`;

export const Header = styled.header`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;

  h1 {
    margin: 0;
    font-size: 3rem;
    font-variant: small-caps;
    color: ${({ theme }) => theme.color.main};
  }
`;

export const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

export const Footer = styled.footer`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  min-width: 63rem;
  max-width: 80rem;
  font-weight: 400;

  > div {
    display: flex;
    justify-content: space-between;

    > div {
      display: flex;
      flex-direction: column;
      text-align: center;

      span:first-of-type {
        font-size: 1.5rem;
      }

      span:last-of-type {
        font-size: 0.8rem;
      }
    }
  }

  > p {
    margin: 0;
    text-align: center;

    > span {
      color: ${({ theme }) => theme.color.heart};
      font-size: 1.5rem;
      vertical-align: sub;
    }
  }

  > div,
  > p {
    margin-top: 1rem;
  }
`;

const GithubLink = styled.a.attrs({
  href: "https://github.com/protofire/open-cdp",
  target: "_blank",
  rel: "noopener noreferrer"
})``;

const Octocat = styled.img.attrs({
  src: "/images/octocat.png",
  alt: "GitHub"
})`
  max-width: 2rem;
  max-height: 2rem;
  vertical-align: text-bottom;
`;

export const Github = () => (
  <GithubLink>
    <Octocat />
  </GithubLink>
);

export const Section = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;

  min-width: 63rem;
  max-width: 80rem;

  margin: 0.5rem 0;
  padding: 2.4rem 0 0;

  font-size: 1.2rem;
  font-weight: 500;

  background-color: ${({ theme }) => theme.color.sectionBg};
  border: 2px solid ${({ theme }) => theme.color.main};
  border-radius: ${({ theme }) => theme.border.radius};

  h2 {
    position: absolute;
    top: -2px;
    left: -2px;
    margin: 0;
    padding: 0.5rem 0.75rem;
    color: ${({ theme }) => theme.color.sectionTag};
    font-size: 1.2rem;
    background-color: ${({ theme }) => theme.color.main};
    border-bottom-right-radius: 0.25rem;
    border-top-left-radius: 0.25rem;
  }
`;

export const Address = styled.span`
  position: absolute;
  top: 0.1rem;
  right: 0.3rem;
  font-size: 0.8rem;
  font-weight: 400;
  color: ${({ theme }) => theme.color.text};
`;

export const Help = styled.i`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 1rem;
  height: 1rem;
  color: ${({ theme }) => theme.color.help};
  border: 2px solid ${({ theme }) => theme.color.help};
  border-radius: 50%;
  font-size: 1rem;
  font-style: normal;
  font-weight: 600;
`;

export const Block = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  position: relative;

  margin: 1rem 0;

  label {
    div:nth-child(1) {
      display: flex;
      justify-content: flex-start;

      ${Help} {
        margin-left: 0.5rem;
      }
    }

    div:nth-child(2) {
      position: relative;

      span {
        color: ${({ theme }) => theme.color.gray};
        font-size: 2rem;
        font-weight: 400;
        position: absolute;
        top: 0.3rem;
        right: 0.5rem;
      }
    }

    div:nth-child(3) {
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
    }
  }

  .eth-in-usd {
    color: ${({ theme }) => theme.color.gray};
    font-size: 1rem;
    font-style: normal;
  }

  .safety-percent {
    font-size: 3rem;
    position: absolute;
    width: 24rem;
    text-align: center;
    top: -1.8rem;
    color: ${({ theme }) => theme.color.gray};

    i {
      color: ${({ theme }) => theme.color.softGray};
      font-size: 2.2rem;
      font-style: normal;
    }
  }

  .safety-points {
    display: flex;
    justify-content: space-around;

    span {
      flex: 1;
      font-size: 0.8rem;
      text-transform: uppercase;
    }

    span:nth-child(1) {
      text-align: left;
    }

    span:nth-child(2) {
      text-align: center;
    }

    span:nth-child(3) {
      text-align: right;
    }
  }

  .textual {
    font-size: 1.1rem;
    font-weight: 400;

    span {
      font-weight: 600;
    }
  }

  .no-cdps-found {
    font-style: italic;
  }
`;

export const ToggleOptions = styled.span`
  cursor: pointer;
  position: absolute;
  right: 3.8rem;
  bottom: 0;
  font-size: 1rem;
  color: ${({ theme }) => theme.color.gray};
`;

const Input = styled.input`
  text-align: center;
  border: 2px solid ${({ theme }) => theme.color.softGray};
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: ${({ theme }) => theme.border.radius};

  &::placeholder {
    color: ${({ theme }) => theme.color.softGray};
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }
`;

export const WizardNumberInput = styled(Input).attrs({
  type: "number"
})`
  max-width: 24rem;
  font-size: 2rem;
  padding: 0;
  margin: 0;
  min-height: 2.8rem;
  line-height: 2.8rem;
  -moz-appearance: textfield;
}

  &:focus {
    outline: none;
    border: 2px solid ${({ theme }) => theme.color.gray};
  }
`;

export const Button = styled.button.attrs({
  type: "button"
})`
  color: ${({ theme }) => theme.color.sectionTag};
  border: none;
  background-color: ${({ theme }) => theme.color.secondary};
  border-radius: ${({ theme }) => theme.border.radius};
  text-align: center;
  font-size: 1.6rem;
  font-weight: 500;
  line-height: 2rem;
  padding: 0.5rem 0.8rem;
`;

export const Modal = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  z-index: 1000;
  background-color: ${({ theme }) => theme.color.modalBg};
`;

const Dialog = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  min-width: 38rem;
  max-width: 38rem;
  width: 100%;

  background-color: ${({ theme }) => theme.color.sectionBg};
  border: 4px solid ${({ theme }) => theme.color.main};
  border-radius: ${({ theme }) => theme.border.radius};

  h3 {
    font-size: 1.3rem;
  }

  p {
    margin: 0.5rem 0;
    font-size: 1.1rem;
    font-weight: 400;

    span {
      font-weight: 600;
    }
  }

  img {
    width: 6rem;
    height: 6rem;
    margin: 0.5rem 0 1rem;
  }

  div.buttons {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 1rem 0 1.5rem;
    width: 100%;
  }
`;

const DialogButton = styled(Button)`
  font-size: 1.2rem;
  line-height: 1.6rem;
  padding: 0.4rem 0.9rem;
`;

const AcceptDialogButton = styled(DialogButton)`
  background-color: ${({ theme }) => theme.color.secondary};
`;

const CancelDialogButton = styled(DialogButton)`
  background-color: ${({ theme }) => theme.color.softGray};
`;

export const ConfirmTx = props => {
  const {
    data: { eth, dai, toggleDialog, confirmTx }
  } = props;

  return (
    <Modal>
      <Dialog>
        <h3>Confirm CDP creation?</h3>
        <p>
          You are going to lock up <span>{eth} ETH</span> and receive <span>{dai} DAI</span>.
        </p>
        <p>Are you sure you want to proceed with this transaction?</p>
        <div className="buttons">
          <CancelDialogButton onClick={() => toggleDialog()}>Cancel</CancelDialogButton>
          <AcceptDialogButton onClick={() => confirmTx()}>Accept</AcceptDialogButton>
        </div>
      </Dialog>
    </Modal>
  );
};

export const Waiting = () => (
  <Modal>
    <Dialog>
      <h3>Waiting...</h3>
      <p>Please accept pending transaction on your wallet.</p>
      <img src="/images/waiting-coin.svg" alt="Waiting" />
    </Dialog>
  </Modal>
);

export const Mining = () => (
  <Modal>
    <Dialog>
      <h3>Creating CDP!</h3>
      <p>Your CDP creation transaction is in progress on the blockchain.</p>
      <p>Please be patient till it finishes, shouldn't take too long.</p>
      <img src="/images/working-gears.svg" alt="Mining" />
    </Dialog>
  </Modal>
);

export const Loading = () => (
  <Modal>
    <Dialog>
      <h3>Loading...</h3>
      <p>Your new CDP has been created!</p>
      <p>Now please wait while new data is being loaded.</p>
      <img src="/images/loading-coffee.svg" alt="Loading" />
    </Dialog>
  </Modal>
);

export const Slider = styled.input.attrs({
  type: "range"
})`
  min-width: 24rem;

  & {
    -webkit-appearance: none;
    width: 100%;
    margin: 7px 0;
  }

  &:focus {
    outline: none;
  }

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 11.4px;
    cursor: pointer;
    box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d;
    background-image: linear-gradient(to right, #d1050d, #d15500, #c58300, #afaa00, #8ecd00);
    border-radius: 1.3px;
    border: 0.2px solid #010101;
  }

  &::-webkit-slider-thumb {
    box-shadow: 0.9px 0.9px 1px #000031, 0 0 0.9px #00004b;
    border: 1px solid #000020;
    height: 1.5rem;
    width: 1.5rem;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -7.5px;
  }

  &:focus::-webkit-slider-runnable-track {
    background-image: linear-gradient(to right, #d1050d, #d15500, #c58300, #afaa00, #8ecd00);
  }

  &::-moz-range-track {
    width: 100%;
    height: 11.4px;
    cursor: pointer;
    box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d;
    background-image: linear-gradient(to right, #d1050d, #d15500, #c58300, #afaa00, #8ecd00);
    border-radius: 1.3px;
    border: 0.2px solid #010101;
  }

  &::-moz-range-thumb {
    box-shadow: 0.9px 0.9px 1px #000031, 0 0 0.9px #00004b;
    border: 1.8px solid #000020;
    height: 26px;
    width: 26px;
    border-radius: 13px;
    background: #ffffff;
    cursor: pointer;
  }

  &::-ms-track {
    width: 100%;
    height: 11.4px;
    cursor: pointer;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }

  &::-ms-fill-lower {
    background-image: linear-gradient(to right, #d1050d, #d15500, #c58300, #afaa00, #8ecd00);
    border: 0.2px solid #010101;
    border-radius: 2.6px;
    box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d;
  }

  &::-ms-fill-upper {
    background-image: linear-gradient(to right, #d1050d, #d15500, #c58300, #afaa00, #8ecd00);
    border: 0.2px solid #010101;
    border-radius: 2.6px;
    box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d;
  }

  &::-ms-thumb {
    box-shadow: 0.9px 0.9px 1px #000031, 0 0 0.9px #00004b;
    border: 1.8px solid #000020;
    height: 26px;
    width: 26px;
    border-radius: 13px;
    background: #ffffff;
    cursor: pointer;
  }

  &:focus::-ms-fill-lower {
    background: rgba(80, 113, 169, 0.78);
  }

  &:focus::-ms-fill-upper {
    background: rgba(95, 126, 179, 0.78);
  }
`;
