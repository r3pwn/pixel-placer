CREATE MIGRATION m1vwqsid5pscolzoyusdnekpshhrblqsh5y2ntphpv7m2gqfvxqesq
    ONTO m1wrksqntk7bvmjo7o66td7zugfl5datybwlfhsyfocpowcuirq2ra
{
  ALTER TYPE default::CanvasPixel {
      DROP CONSTRAINT std::exclusive ON (.coord_pair);
  };
  ALTER TYPE default::CanvasPixel {
      CREATE CONSTRAINT std::exclusive ON ((.x, .y));
      DROP PROPERTY coord_pair;
  };
};
