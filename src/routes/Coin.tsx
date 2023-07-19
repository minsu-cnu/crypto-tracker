import { useEffect, useState } from "react";
import {
  Link,
  Route,
  Switch,
  useLocation,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import { styled } from "styled-components";
import Price from "./Price";
import Chart from "./Chart";
import { useQuery } from "react-query";
import { fetchCoinInfo, fetchCoinTickers } from "./api";
import { Helmet } from "react-helmet";

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.span`
  display: block;
  text-align: center;
`;

const Container = styled.div`
  position: relative;
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Header = styled.header`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  margin: 30px auto;
  height: 15vh;

  a {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 0;
    padding: 10px;
    border-radius: 50%;
    background-color: ${(props) => props.theme.boxBgColor};
  }
`;

const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px auto;
  padding: 15px;
  background-color: ${(props) => props.theme.boxBgColor};
  border-radius: 10px;
`;

const Description = styled.p`
  line-height: 1.3;
`;

const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  span:first-child {
    margin-bottom: 10px;
    font-size: 12px;
    text-transform: uppercase;
  }

  span:last-child {
    font-size: 16px;
  }
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin: 25px 0px;
`;

const Tab = styled.span<{ $isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  background-color: ${(props) => props.theme.boxBgColor};
  padding: 7px 0px;
  border-radius: 10px;
  color: ${(props) =>
    props.$isActive ? props.theme.accentColor : props.theme.textColor};

  a {
    display: block;
  }
`;

interface RouteParams {
  coinId: string;
}

interface RouteState {
  name: string;
}

interface InfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  logo: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
}

interface PriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
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
  };
}

interface ICoinProps {}

function Coin({}: ICoinProps) {
  /* const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<InfoData>();
  const [priceInfo, setPriceInfo] = useState<PriceData>(); */

  const { coinId } = useParams<RouteParams>();
  const { state } = useLocation<RouteState>();

  const priceMatch = useRouteMatch("/:coinId/price");
  const chartMatch = useRouteMatch("/:coinId/chart");
  const { isLoading: infoLoading, data: infoData } = useQuery<InfoData>(
    ["info", coinId],
    () => fetchCoinInfo(coinId)
    // { refetchInterval: 5000 }
  );
  const { isLoading: tickersLoading, data: tickersData } = useQuery<PriceData>(
    ["tickers", coinId],
    () => fetchCoinTickers(coinId)
  );

  const loading = infoLoading || tickersLoading;

  /* useEffect(() => {
    (async () => {
      const infoData = await (
        await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)
      ).json();
      const priceInfoData = await (
        await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
      ).json();
      setInfo(infoData);
      setPriceInfo(priceInfoData);
      setLoading(false);
    })();
  }, []); */

  return (
    <Container>
      <Helmet>
        <title>
          {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
        </title>
      </Helmet>
      <Header>
        <Link to="/">&larr;</Link>
        <Title>
          {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
        </Title>
      </Header>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Overview>
            <OverviewItem>
              <span>rank:</span>
              <span>{infoData?.rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span>symbol:</span>
              <span>{infoData?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Price:</span>
              <span>{tickersData?.quotes.USD.price.toFixed(3)}</span>
            </OverviewItem>
          </Overview>
          <Description>{infoData?.description}</Description>
          <Overview>
            <OverviewItem>
              <span>total supply:</span>
              <span>{tickersData?.total_supply}</span>
            </OverviewItem>
            <OverviewItem>
              <span>max supply:</span>
              <span>{tickersData?.max_supply}</span>
            </OverviewItem>
          </Overview>

          <Tabs>
            <Tab $isActive={chartMatch !== null}>
              <Link to={`/${coinId}/chart`}>Chart</Link>
            </Tab>
            <Tab $isActive={priceMatch !== null}>
              <Link
                to={{
                  pathname: `/${coinId}/price`,
                  state: { priceData: tickersData?.quotes.USD },
                }}
              >
                Price
              </Link>
            </Tab>
          </Tabs>

          <Switch>
            <Route path={`/:coinId/chart`}>
              <Chart coinId={coinId} />
            </Route>
            <Route path={`/:coinId/price`}>
              <Price />
            </Route>
          </Switch>
        </>
      )}
    </Container>
  );
}
export default Coin;
