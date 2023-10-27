import {
  Link,
  Outlet,
  useLocation,
  useParams,
  useMatch,
} from 'react-router-dom';
import styled from 'styled-components';
import { useState } from 'react';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCoinInfo } from '../api';
import { fetchCoinTickers } from '../api';
const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
  a {
    margin-right: 50px;
    font-size: 20px;
  }
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 10px;
`;
const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;
const Description = styled.p`
  margin: 20px 0px;
`;

interface RouteState {
  state: {
    name: string;
  };
}

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;

const Tab = styled.span<{ $isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 7px 0px;
  border-radius: 10px;
  color: ${(props) =>
    props.$isActive
      ? props.theme.accentColor
      : props.theme.textColor};
  a {
    display: block;
  }
`;

interface IInfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  contract: string;
  platform: string;
  contracts: object;
  logo: string;
  parent: object;
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

interface IPriceData {
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
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}

function Coin() {
  const { id } = useParams();
  const { state } = useLocation() as RouteState;
  const priceMatch = useMatch('/:coinId/price');
  const chartMatch = useMatch('/:coinId/chart');
  const { isLoading: infoLoading, data: infos } =
    useQuery<IInfoData>({
      queryKey: ['info', id],
      queryFn: () => fetchCoinInfo(`${id}`),
    });
  const { isLoading: priceLoading, data: prices } =
    useQuery<IPriceData>({
      queryKey: ['tickers', id],
      queryFn: () => fetchCoinTickers(`${id}`),
      refetchInterval: 3000,
    });
  // const [loading, setLoading] = useState(true);
  // const [info, setInfo] = useState<IInfoData>();
  // const [price, setPrice] = useState<IPriceData>();
  // useEffect(() => {
  //   (async () => {
  //     const infoData = await (
  //       await fetch(
  //         `https://api.coinpaprika.com/v1/coins/${id}`
  //       )
  //     ).json();
  //     const priceData = await (
  //       await fetch(
  //         `https://api.coinpaprika.com/v1/tickers/${id}`
  //       )
  //     ).json();
  //     setInfo(infoData);
  //     setPrice(priceData);
  //     setLoading(false);
  //   })();
  // }, []);
  const loading = infoLoading || priceLoading;
  return (
    <Container>
      <Header>
        <Title>
          <Link to="/">&larr;home</Link>
          {state?.name
            ? state.name
            : loading
            ? 'Loading...'
            : infos?.name}
        </Title>
      </Header>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Overview>
            <OverviewItem>
              <span>Rank:</span>
              <span>{infos?.rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Symbol:</span>
              <span>${infos?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Price:</span>
              <span>
                {prices?.quotes.USD.price
                  .toFixed(3)
                  .toString()}
              </span>
            </OverviewItem>
          </Overview>
          <Description>{infos?.description}</Description>
          <Overview>
            <OverviewItem>
              <span>Total Suply:</span>
              <span>{prices?.total_supply}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Max Supply:</span>
              <span>{prices?.max_supply}</span>
            </OverviewItem>
          </Overview>
          <Tabs>
            <Tab $isActive={chartMatch !== null}>
              <Link to={`/${id}/chart`}>Chart</Link>
            </Tab>
            <Tab $isActive={priceMatch !== null}>
              <Link to={`/${id}/price`}>Price</Link>
            </Tab>
          </Tabs>
          <Outlet context={{ coinId: id }} />
        </>
      )}
    </Container>
  );
}
export default Coin;
