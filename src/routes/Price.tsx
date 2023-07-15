import { Route, useLocation } from "react-router-dom";
import { styled } from "styled-components";

interface RouteState {
  priceData: {
    price: number;
    volume_24h: number;
    volume_24h_change_24h: number;
    market_cap: number;
    market_cap_change_24h: number;
    percent_change_15m: number;
    percent_change_30m: number;
    percent_change_1h: number;
    percent_change_6h: number;
    percent_change_12h: number;
    percent_change_24h: number;
    percent_change_7d: number;
    percent_change_30d: number;
    percent_change_1y: number;
    ath_price: number;
    ath_date: string;
    percent_from_price_ath: number;
  };
}

interface IChangeValue {
  isPositive: boolean;
}

const AthPrice = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  padding: 15px;
  border-radius: 10px;
  background-color: ${(props) => props.theme.boxBgColor};

  > h1 {
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid grey;
    font-size: 22px;
  }

  > ChangeValue:nth-of-type(1) {
    margin-bottom: 10px;
  }
`;

const ChangePrice = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
`;

const ChangeItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 15px;
  border-radius: 15px;
  background-color: ${(props) => props.theme.boxBgColor};

  > h2 {
    margin-bottom: 20px;
    font-size: 16px;
    font-weight: 600;
    color: grey;
  }
`;

const ChangeValue = styled.span<IChangeValue>`
  font-size: 28px;
  color: ${(props) => (props.isPositive ? "#f53b57" : "#4bcffa")};
`;

function Price() {
  const { state } = useLocation<RouteState>();
  console.log(state?.priceData);
  return (
    <div>
      <AthPrice>
        <h1>Highest Price</h1>
        <span>
          Date : {new Date(state?.priceData.ath_date).toLocaleDateString()}
        </span>
        <span>Price : ${state?.priceData.ath_price.toFixed(3)}</span>
      </AthPrice>
      <ChangePrice>
        <ChangeItem>
          <h2>1시간 전보다</h2>
          <ChangeValue
            isPositive={state?.priceData.percent_change_1h >= 0 ? true : false}
          >
            {state?.priceData.percent_change_1h}%
          </ChangeValue>
        </ChangeItem>
        <ChangeItem>
          <h2>6시간 전보다</h2>
          <ChangeValue
            isPositive={state?.priceData.percent_change_6h >= 0 ? true : false}
          >
            {state?.priceData.percent_change_6h}%
          </ChangeValue>
        </ChangeItem>
        <ChangeItem>
          <h2>12시간 전보다</h2>
          <ChangeValue
            isPositive={state?.priceData.percent_change_12h ? true : false}
          >
            {state?.priceData.percent_change_12h}%
          </ChangeValue>
        </ChangeItem>
        <ChangeItem>
          <h2>24시간 전보다</h2>
          <ChangeValue
            isPositive={state?.priceData.percent_change_24h ? true : false}
          >
            {state?.priceData.percent_change_24h}%
          </ChangeValue>
        </ChangeItem>
      </ChangePrice>
    </div>
  );
}

export default Price;
