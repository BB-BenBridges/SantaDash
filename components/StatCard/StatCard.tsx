import { Center, Group, Paper, RingProgress, Text } from "@mantine/core";

interface Iprops {
  Icon: any;
  Value: string;
  Title: string;
  Percent: number;
}

export default function StatCard({ Icon, Value, Title, Percent }: Iprops) {
  return (
    <Paper withBorder radius="md" p="xs" key="Presents" w={"500"}>
      <Group>
        <RingProgress
          size={80}
          roundCaps
          thickness={8}
          sections={[
            {
              value: Percent,
              color: "indigo.6",
            },
          ]}
          label={
            <Center>
              <Icon size={20} stroke={1.5} />
            </Center>
          }
        />

        <div>
          <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
            {Title}
          </Text>
          <Text fw={700} size="xl">
            {Value}
          </Text>
        </div>
      </Group>
    </Paper>
  );
}
