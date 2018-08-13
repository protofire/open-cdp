import React from "react";
import styled from "styled-components";

const CommonScreenStyled = styled.div`
  max-width: 30rem;
  padding: 1rem 3rem;
  margin: auto;

  text-align: center;
  color: white;

  background-color: ${({ theme }) => theme.color.main};
  border: 2px solid ${({ theme }) => theme.color.main};
  border-radius: ${({ theme }) => theme.border.radius};

  p {
    line-height: 1.5rem;
    font-weight: 500;
  }

  a,
  &:visited {
    color: ${({ theme }) => theme.color.sectionTag};
  }
`;

const NoWeb3Styled = styled(CommonScreenStyled)``;

export const NoWeb3Screen = () => (
  <NoWeb3Styled>
    <h2>No Web3 Available</h2>
    <p>You need a wallet manager in order to use OpenCDP.</p>
    <p>
      Most popular option is Metamask:{" "}
      <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">
        https://metamask.io/
      </a>
    </p>
  </NoWeb3Styled>
);

const NoAccountStyled = styled(CommonScreenStyled)``;

export const NoAccountScreen = () => (
  <NoAccountStyled>
    <h2>No Web3 Account Selected</h2>
    <p>
      Please login with your preferred wallet manager and choose the address you want to use OpenCDP
      with.
    </p>
  </NoAccountStyled>
);
