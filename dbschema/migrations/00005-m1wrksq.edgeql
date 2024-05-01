CREATE MIGRATION m1wrksqntk7bvmjo7o66td7zugfl5datybwlfhsyfocpowcuirq2ra
    ONTO m1h5bqlcu4exnhtsm6kbtd6zl24k3kzkmlbkfllmi4nsxyz6t2uunq
{
  ALTER TYPE default::CanvasPixel {
      ALTER PROPERTY x {
          DROP CONSTRAINT std::max_value(9);
      };
  };
  ALTER TYPE default::CanvasPixel {
      ALTER PROPERTY x {
          CREATE CONSTRAINT std::max_value(999);
      };
  };
  ALTER TYPE default::CanvasPixel {
      ALTER PROPERTY y {
          DROP CONSTRAINT std::max_value(9);
      };
  };
  ALTER TYPE default::CanvasPixel {
      ALTER PROPERTY y {
          CREATE CONSTRAINT std::max_value(999);
      };
  };
};
