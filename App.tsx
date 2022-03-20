import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Switch, Text, View } from 'react-native';
import Button, { ButtonColorScheme } from './src/components/Button';
import { useRef, useState } from 'react';

const NUMBERS = {
  first: [7, 8, 9],
  second: [4, 5, 6],
  third: [1, 2, 3],
}

enum OPERATORS {
  multiple = 'multiple',
  plus = 'plus',
  div = 'div',
  percent = 'percent',
  minus = 'minus',
}

const calculateResult = (stack: Array<number | string>, number: string) => {
  const currentNum = +number;
  const flow = [...stack, currentNum];
  let i = 0;
  while(flow.length > 1) {
    if (i >= flow.length - 1) {
      i = 0;
    }
    if (typeof flow[i] === 'string') {
      const multipleLastIndex = flow.lastIndexOf(OPERATORS.multiple);
      const divLastIndex = flow.lastIndexOf(OPERATORS.div);
      const isSkipStep = multipleLastIndex > i || divLastIndex > i;
      const nextNum = +flow[i + 1];
      switch (flow[i]) {
        case OPERATORS.multiple:
          flow.splice(i - 1, 3, +flow[i - 1] * nextNum);
          break;
        case OPERATORS.div:
          flow.splice(i - 1, 3, +flow[i - 1] / nextNum);
          break;
        case OPERATORS.plus:
          if (isSkipStep) {
            break;
          }
          flow.splice(i - 1, 3, +flow[i - 1] + nextNum);
          break;
        case OPERATORS.percent:
          flow.splice(i - 1, 3, +flow[i - 1] / 100);
          break;
        case OPERATORS.minus:
          if (isSkipStep) {
            break;
          }

          flow.splice(i - 1, 3, +flow[i -1] - nextNum);
          break;
        default: break;
      }
    }

    i++;
  }

  return flow[0];
}

export default function App() {
  const [number, setNumber] = useState('0');
  const [stack, setStack] = useState<Array<number | OPERATORS>>([]);
  const [operation, setOperation] = useState<undefined | OPERATORS>();
  const [isNewNumber, setIsNewNumber] = useState(false);

  const handleChange = (num: number) => {
    if (number === '0' || isNewNumber) {
      setNumber(String(num));
      setIsNewNumber(false);
      return;
    }

    setNumber(prev => prev + num);
  }

  const onAddDot = () => {
    if (!number.includes('.')) {
      setNumber(prev => prev + '.');
    }
  }

  const clear = () => {
    setNumber('0');
    setStack([]);
    setIsNewNumber(false);
  }

  const calculate = () => {
    const res = calculateResult(stack, number);
    setStack([]);
    setNumber(String(res));
  }

  const handleChangeOperator = (operator: OPERATORS) => {
    if (!isNewNumber) {
      setStack(prev => [...prev, +number, operator]);
      setIsNewNumber(true);
    }
  }

  const switchSign = () => {
    setNumber(String(-1 * +number));
  }

  const onPercentage = () => {
    setNumber(String(+calculateResult(stack, number) / 100))
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.textContainer}>
        <Text style={styles.text}>{number}</Text>
      </SafeAreaView>
      <SafeAreaView style={styles.buttons}>
        <Button onClick={clear} colorScheme={ButtonColorScheme.GRAY}>AC</Button>
        <Button onClick={switchSign} colorScheme={ButtonColorScheme.GRAY}>+/-</Button>
        <Button onClick={onPercentage} colorScheme={ButtonColorScheme.GRAY}>%</Button>
        <Button onClick={() => handleChangeOperator(OPERATORS.div)} colorScheme={ButtonColorScheme.ORANGE}>/</Button>

        {NUMBERS.first.map(num => (
            <Button key={num} onClick={() => handleChange(num)}>{num}</Button>
        ))}
        <Button onClick={() => handleChangeOperator(OPERATORS.multiple)} colorScheme={ButtonColorScheme.ORANGE}>*</Button>

        {NUMBERS.second.map(num => (
            <Button key={num} onClick={() => handleChange(num)}>{num}</Button>
        ))}
        <Button onClick={() => handleChangeOperator(OPERATORS.minus)} colorScheme={ButtonColorScheme.ORANGE}>-</Button>

        {NUMBERS.third.map(num => (
            <Button key={num} onClick={() => handleChange(num)}>{num}</Button>
        ))}
        <Button onClick={() => handleChangeOperator(OPERATORS.plus)} colorScheme={ButtonColorScheme.ORANGE}>+</Button>

        <Button twoWidth onClick={() => handleChange(0)}>0</Button>
        <Button onClick={onAddDot}>.</Button>
        <Button onClick={calculate} colorScheme={ButtonColorScheme.ORANGE}>=</Button>
      </SafeAreaView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttons: {
    flex: 2,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  textContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: '100%',
  },

  text: {
    color: '#fff',
    fontSize: 60,
    marginRight: 35
  }
});
