import { render, screen } from '@testing-library/react';
import React from 'react';
import { Text, View } from 'react-native';

describe('Health Check', () => {
  it('renders a simple component', () => {
    render(
      <View>
        <Text>Test works!</Text>
      </View>
    );

    expect(screen.getByText('Test works!')).toBeInTheDocument();
  });

  it('basic assertions work', () => {
    expect(1 + 1).toBe(2);
    expect(true).toBeTruthy();
    expect([1, 2, 3]).toHaveLength(3);
  });
});
