import { AreaChart } from "@mantine/charts";
import { Container, Grid, Stack, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { IconDeer, IconGift, IconUsers, IconWorld } from "@tabler/icons-react";
import StatCard from "../components/StatCard/StatCard";
import { activeDeer, inactiveDeer } from "../lib/deer";
import { DataTable } from "mantine-datatable";
import { useWakeLock } from "react-screen-wake-lock";
import { countries } from "../lib/countries";

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

interface presents {
  date: string;
  Presents: number;
}

export default function IndexPage() {
  const [presentData, setPresentData] = useState<presents[]>();
  const [elves, setElves] = useState(43);
  const { isSupported, released, request, release } = useWakeLock({
    onError: () => alert("An error happened 💥"),
    onRelease: () => alert("Screen Wake Lock: released!"),
  });
  const [country, setCountry] = useState<string>("");

  useEffect(() => {
    if (isSupported) {
      console.log("Screen Wake Lock: supported!");
      request();
    }
  }, [request, isSupported]);

  useEffect(() => {
    for (var i = 20; i >= 0; i--) {
      setPresentData((current) => {
        const now = new Date();
        now.setSeconds(now.getSeconds() - 10 * i);
        const last = current ? current.slice(-1)[0] : { Presents: 6000000000 };
        return [
          ...(current ? current : []),
          {
            date: now.toLocaleString(),
            Presents: randomIntFromInterval(
              last.Presents + 400000,
              last.Presents + 600000
            ),
          },
        ];
      });
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("This runs every 5 seconds");
      // Call your function here
      setPresentData((current) => {
        if (!current) return undefined;
        const last = current.slice(-1)[0];
        return [
          ...current,
          {
            date: new Date().toLocaleString(),
            Presents: randomIntFromInterval(
              last.Presents + 4000,
              last.Presents + 10000000
            ),
          },
        ];
      });
      setElves(randomIntFromInterval(0, 200));
      //get random country
      const name = countries[Math.floor(Math.random() * countries.length)];
      setCountry(name);
    }, 5000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  if (!presentData) return null;
  return (
    <Container size="xl">
      <Grid>
        <Grid.Col span={6}>
          <AreaChart
            h={300}
            w={"500"}
            data={presentData.slice(-20)}
            dataKey="date"
            series={[{ name: "Presents", color: "green.6" }]}
            curveType="linear"
            yAxisProps={{ domain: ["auto", "auto"] }}
            mt={20}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Stack gap={"xs"} mt={20}>
            <StatCard
              Icon={IconGift}
              Value={`${
                presentData.slice(-1)[0].Presents / 1000000000
              } Billion`}
              Title="Total Presents"
              Percent={(presentData.slice(-1)[0].Presents / 8200000000) * 100}
            />
            <StatCard
              Icon={IconUsers}
              Value={elves.toString()}
              Title="Elves On Shift"
              Percent={(elves / 200) * 100}
            />
            <StatCard
              Icon={IconWorld}
              Value={country}
              Title="Preparing Presents For"
              Percent={100}
            />
          </Stack>
        </Grid.Col>
        <Grid.Col span={6}>
          <Stack gap={"xs"} mt={20}>
            <Title order={4}>Active Raindeer</Title>
            <DataTable
              columns={[
                { accessor: "name" },
                { accessor: "position" },
                { accessor: "age" },
              ]}
              records={activeDeer}
            />
          </Stack>
        </Grid.Col>
        <Grid.Col span={6}>
          <Stack gap={"xs"} mt={20}>
            <Title order={4}>Inactive Raindeer</Title>
            <DataTable
              columns={[
                { accessor: "name" },
                { accessor: "position" },
                { accessor: "age" },
              ]}
              records={inactiveDeer}
            />
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
