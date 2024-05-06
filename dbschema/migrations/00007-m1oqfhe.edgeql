CREATE MIGRATION m1oqfhemmbfuqy7dnnlch7vyatr6cjdyxa6d6yigwgexqzwltyffba
    ONTO m1vwqsid5pscolzoyusdnekpshhrblqsh5y2ntphpv7m2gqfvxqesq
{
  ALTER TYPE default::CanvasPixel {
      CREATE REQUIRED PROPERTY updated_at: std::datetime {
          SET REQUIRED USING (<std::datetime>{'2001-01-01T01:01:01+00'});
      };
      CREATE INDEX ON (.updated_at);
  };
};
