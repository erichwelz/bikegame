volatile unsigned long ticks = 0;
long last_edge = 0;

void setup()
{
  Serial.begin(9600);

  pinMode(2, INPUT_PULLUP);
  attachInterrupt(0, handle_interrupt, FALLING); // INT0 is Pin 2 on UNO
  
  print_ticks();
}

void loop()
{
  if (Serial.available() > 0) {
    Serial.read(); // Just get one byte, we don't care what it is
    
    print_ticks();
  }
}

void print_ticks() {
  Serial.print(ticks);
  Serial.write('\n');
}

void handle_interrupt()
{
  // At 2400 rpm (very fast!), we get one rotation every 25mS.
  if((millis() - last_edge) > 10) {
    last_edge = millis();
    ticks = ticks + 1;
  }
}
