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
  justify-content: flex-end;
  align-items: center;

  position: relative;
  padding: 0;
  min-height: 4.5rem;
  max-height: 4.5rem;
  min-width: 63rem;
  max-width: 63rem;
  text-align: center;

  h1 {
    margin: 0;
    font-size: 2.3rem;
    font-variant: small-caps;
    color: ${({ theme }) => theme.color.main};
  }

  h4 {
    margin: 0;
    padding: 0.2rem 0.5rem;
    user-select: none;
    font-size: 1rem;
    font-variant: small-caps;
    color: ${({ theme }) => theme.color.sectionTag};
    background-color: ${({ theme }) => theme.color.demoBg};
  }
`;

export const MetaMask = styled.img.attrs({
  src: "/images/metamask.png",
  alt: "MetaMask"
})`
  max-height: 1.2rem;
  vertical-align: text-bottom;
  margin: 0 0.4rem 0.1rem 0;
`;

export const Main = styled.main`
  flex: 3;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

export const Footer = styled.footer`
  flex: 1;
  display: flex;
  flex-direction: column-reverse;
  min-width: 63rem;
  max-width: 63rem;
  width: 100%;
  font-weight: 400;
  padding-bottom: 0.5rem;

  > p {
    margin: 1rem 0 0;
    text-align: center;

    > span {
      color: ${({ theme }) => theme.color.heart};
      font-size: 1.5rem;
      vertical-align: sub;
    }
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
  max-height: 2rem;
  vertical-align: text-bottom;
`;

export const Github = () => (
  <GithubLink>
    <Octocat />
  </GithubLink>
);

const ProtofireLink = styled.a.attrs({
  href: "https://protofire.io",
  target: "_blank",
  rel: "noopener noreferrer"
})`
  margin-left: 0.3rem;
`;

const ProtofireLogo = styled.img.attrs({
  src: "/images/protofire.png",
  alt: "Protofire"
})`
  max-height: 2rem;
  vertical-align: bottom;
`;

export const Protofire = () => (
  <ProtofireLink>
    <ProtofireLogo />
  </ProtofireLink>
);

export const Section = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;

  min-width: 63rem;
  max-width: 63rem;

  margin: 1rem 0 0;
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
    border-bottom-right-radius: ${({ theme }) => theme.border.radius};
    border-top-left-radius: ${({ theme }) => theme.border.radius};
  }

  .redText {
    color: red;
  }

  &.general-info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border: none;
    padding: 0;

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

  .advanced-options-enter {
    opacity: 0.01;
  }

  .advanced-options-enter.advanced-options-enter-active {
    opacity: 1;
    transition: opacity 500ms ease-in;
  }

  .advanced-options-leave {
    opacity: 1;
  }

  .advanced-options-leave.advanced-options-leave-active {
    opacity: 0.01;
    transition: opacity 300ms ease-in;
  }

  .connect-button {
    position: absolute;
    right: 0;
    top: -2.3rem;
    font-size: 1.2rem;
    padding: 0.1rem 0.5rem 0.2rem;
  }
`;

export const TokenIconWrapper = styled.span`
  display: flex;
  align-items: center;
`;

export const IconDAI = styled.img.attrs({
  src: "/images/token-dai.png",
  alt: "DAI"
})`
  height: 1.3rem;
  margin: 0 0.3rem;
`;

export const IconETH = styled.img.attrs({
  src: "/images/token-eth.png",
  alt: "ETH"
})`
  height: 1.3rem;
  margin: 0 0.3rem;
`;

const DollarSignStyled = styled.i`
  color: ${({ theme }) => theme.color.gray};
  font-size: 0.7rem;
  font-style: normal;
  font-weight: 600;
`;

export const DollarSign = () => <DollarSignStyled>U$D</DollarSignStyled>;

export const Address = styled.span`
  position: absolute;
  top: 0.1rem;
  right: 0.3rem;
  font-size: 0.8rem;
  font-weight: 400;
  color: ${({ theme }) => theme.color.text};
`;

export const HelpIcon = styled.i`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;

  width: 1rem;
  height: 1rem;
  color: ${({ theme }) => theme.color.main};
  border: 2px solid ${({ theme }) => theme.color.help};
  border-radius: 50%;
  font-size: 1rem;
  font-style: normal;
  font-weight: 600;
`;

const HelpBubble = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 0;
  padding: 0 1rem;
  z-index: 100;

  max-width: 10rem;
  width: 100%;

  line-height: 1.2rem;
  color: ${({ theme }) => theme.color.sectionTag};

  background-color: ${({ theme }) => theme.color.secondary};
  border: 2px solid ${({ theme }) => theme.color.helpBorder};
  border-radius: ${({ theme }) => theme.border.radius};
`;

export const HelpPopup = props => <HelpBubble>{props.children}</HelpBubble>;

export const WalletCdpsTable = styled.table`
  width: 100%;
  font-size: 1rem;
  text-align: center;

  thead,
  tbody {
    display: block;
  }

  thead th {
    color: ${({ theme }) => theme.color.main};
  }

  tbody,
  thead {
    td,
    th {
      width: 11rem;
      padding: 0.24rem 0;
    }

    td:first-of-type,
    th:first-of-type {
      width: 7rem;
    }

    td:last-of-type,
    th:last-of-type {
      width: 23rem;
    }
  }

  tbody {
    height: 7.8rem;
    overflow-y: auto;
    overflow-x: hidden;
  }

  button {
    padding: 0.3rem 0.4rem;
    margin: 0 1px;
    border: 0;
    border-radius: 0.5rem;
    background-color: ${({ theme }) => theme.color.main};
    color: ${({ theme }) => theme.color.sectionBg};
    font-size: 0.9rem;
    font-weight: 500;
    font-variant: petite-caps;

    &:hover {
      background-color: ${({ theme }) => theme.color.secondary};
    }

    &:disabled {
      cursor: not-allowed;
      color: ${({ theme }) => theme.color.softGray};
      background-color: ${({ theme }) => theme.color.gray};
    }
  }
`;

export const SetMaxEth = styled.span`
  cursor: pointer;
  font-size: 0.8rem;
  margin: auto 0 0 auto;
  color: ${({ theme }) => theme.color.main};

  &:hover {
    color: ${({ theme }) => theme.color.secondary};
  }
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
      position: relative;

      ${HelpIcon} {
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
    font-size: 0.8rem;
    font-style: normal;
  }

  .safety-percent {
    position: absolute;
    top: -1.8rem;
    width: 24rem;
    font-size: 3rem;
    text-align: center;
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
  color: ${({ theme }) => theme.color.main};
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
  font-variant: petite-caps;

  &:disabled {
    cursor: not-allowed;
    color: ${({ theme }) => theme.color.softGray};
    background-color: ${({ theme }) => theme.color.gray};
  }
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

export const Dialog = styled.div`
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

  img.coming-soon {
    margin: 1.5rem 0 0.5rem;
  }

  div.buttons {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 1rem 0 1.5rem;
    width: 100%;
  }

  a.tx-etherscan,
  &:visited,
  &:active {
    color: ${({ theme }) => theme.color.main};
    font-size: 0.8rem;
    font-weight: 500;
    text-decoration: none;
  }
`;

const DialogButton = styled(Button)`
  font-size: 1.2rem;
  line-height: 1.6rem;
  padding: 0.4rem 0.9rem;
`;

export const AcceptDialogButton = styled(DialogButton)`
  background-color: ${({ theme }) => theme.color.secondary};
`;

export const CancelDialogButton = styled(DialogButton)`
  background-color: ${({ theme }) => theme.color.softGray};
`;

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
    border-radius: 0; //1.3px;
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
    border-radius: 0; //1.3px;
    border: 0.2px solid #010101;
  }

  &::-moz-range-thumb {
    box-shadow: 0.9px 0.9px 1px #000031, 0 0 0.9px #00004b;
    border: 1.8px solid #000020;
    height: 1.5rem;
    width: 1.5rem;
    border-radius: 50%;
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
    border-radius: 0; //2.6px;
    box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d;
  }

  &::-ms-fill-upper {
    background-image: linear-gradient(to right, #d1050d, #d15500, #c58300, #afaa00, #8ecd00);
    border: 0.2px solid #010101;
    border-radius: 0; //2.6px;
    box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d;
  }

  &::-ms-thumb {
    box-shadow: 0.9px 0.9px 1px #000031, 0 0 0.9px #00004b;
    border: 1.8px solid #000020;
    height: 1.5rem;
    width: 1.5rem;
    border-radius: 50%;
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
