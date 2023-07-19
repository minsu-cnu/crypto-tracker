import { Link } from "react-router-dom";
import { styled } from "styled-components";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { fetchCoins } from "./api";
import { Helmet } from "react-helmet";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isDarkAtom } from "../atoms";

const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Header = styled.header`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30px auto;
  height: 15vh;

  button {
    position: absolute;
    top: 0;
    left: 0;
    padding: 10px 5px;
    border-radius: 10%;
    border: 1px solid ${(props) => props.theme.textColor};
  }
`;

const CoinsList = styled.ul``;

const Coin = styled.li`
  margin-bottom: 10px;
  border-radius: 15px;
  background-color: white;
  color: black;

  a {
    display: flex;
    align-items: center;
    padding: 20px;
    transition: color 0.2s ease-in;
  }

  &:hover {
    a {
      color: ${(props) => props.theme.accentColor};
    }
  }
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.span`
  display: block;
  text-align: center;
`;

const Img = styled.img`
  margin-right: 10px;
  width: 35px;
  height: 35px;
`;

interface ICoin {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

interface ICoinsProps {}

function Coins({}: ICoinsProps) {
  const isDark = useRecoilValue(isDarkAtom);
  const setDarkAtom = useSetRecoilState(isDarkAtom);
  const toggleDarkAtom = () => setDarkAtom((prev) => !prev);
  const { isLoading, data } = useQuery<ICoin[]>("allCoins", fetchCoins);

  /* const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState<ICoin[]>([]);
  useEffect(() => {
    (async () => {
      const response = await fetch("https://api.coinpaprika.com/v1/coins/");
      const json = await response.json();
      setCoins(json.slice(0, 100));
      setLoading(false);
    })();
  }, []); */

  return (
    <Container>
      <Helmet>
        <title>코인</title>
      </Helmet>
      <Header>
        <Title>코인</Title>
        <button onClick={toggleDarkAtom}>
          {isDark ? "dark mode" : "light mode"}
        </button>
      </Header>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <CoinsList>
          {data?.slice(0, 100).map((coin) => (
            <Coin key={coin.id}>
              <Link
                to={{
                  pathname: `/${coin.id}/chart`,
                  state: { name: coin.name },
                }}
              >
                <Img
                  src={`https://coinicons-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}`}
                />
                {coin.name} &rarr;
              </Link>
            </Coin>
          ))}
        </CoinsList>
      )}
    </Container>
  );
}
export default Coins;
