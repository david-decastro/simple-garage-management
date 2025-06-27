import {
  SiAudi,
  SiBmw,
  SiChevrolet,
  SiCitroen,
  SiFiat,
  SiFord,
  SiHonda,
  SiHyundai,
  SiKia,
  SiMazda,
  SiMercedes,
  SiMitsubishi,
  SiNissan,
  SiOpel,
  SiPeugeot,
  SiRenault,
  SiSeat,
  SiSkoda,
  SiSubaru,
  SiToyota,
  SiVolkswagen,
  SiVolvo,
} from "react-icons/si";
import { FaCar } from "react-icons/fa";

const CarBrandIcons = {
  AUDI: { icon: SiAudi, color: "#000000" },
  BMW: { icon: SiBmw, color: "#0066B1" },
  CHEVROLET: { icon: SiChevrolet, color: "#CD9834" },
  CITROEN: { icon: SiCitroen, color: "#1E1E1E" },
  FIAT: { icon: SiFiat, color: "#941739" },
  FORD: { icon: SiFord, color: "#003478" },
  HONDA: { icon: SiHonda, color: "#E40521" },
  HYUNDAI: { icon: SiHyundai, color: "#002C5F" },
  KIA: { icon: SiKia, color: "#BB162B" },
  MAZDA: { icon: SiMazda, color: "#101010" },
  MERCEDES: { icon: SiMercedes, color: "#242424" },
  MITSUBISHI: { icon: SiMitsubishi, color: "#E60012" },
  NISSAN: { icon: SiNissan, color: "#C3002F" },
  OPEL: { icon: SiOpel, color: "#000000" },
  PEUGEOT: { icon: SiPeugeot, color: "#172B4D" },
  RENAULT: { icon: SiRenault, color: "#FDB515" },
  SEAT: { icon: SiSeat, color: "#122683" },
  SKODA: { icon: SiSkoda, color: "#4BA82E" },
  SUBARU: { icon: SiSubaru, color: "#013C74" },
  TOYOTA: { icon: SiToyota, color: "#EB0A1E" },
  VOLKSWAGEN: { icon: SiVolkswagen, color: "#001E50" },
  VOLVO: { icon: SiVolvo, color: "#003057" },
};

export const getCarIcon = (brand) => {
  const normalizedBrand = brand.toUpperCase();
  return CarBrandIcons[normalizedBrand] || { icon: FaCar, color: "#666666" };
};

export default CarBrandIcons;
