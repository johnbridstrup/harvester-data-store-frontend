import { useMemo } from "react";
import {
  darkThemeClass,
  mapErroredServices,
  transformSysmonServices,
} from "@/utils/utils";
import { ErroredService } from "@/features/errorreport/errorreportTypes";

interface ServiceProps {
  services: Record<string, any>;
  errors: Array<ErroredService>;
  theme: string;
}

function ServiceTable(props: ServiceProps) {
  const services = useMemo(
    () => transformSysmonServices(props.services),
    [props.services],
  );
  const erroredservices = useMemo(
    () => mapErroredServices(props.errors),
    [props.errors],
  );
  const evaluateColor = (services: Array<string>, errors: Array<string>) => {
    const found = services.some((service) => errors.includes(service));
    if (found) {
      return "bg-danger";
    } else {
      return "";
    }
  };
  const tabledt = darkThemeClass("dt-table", props.theme);
  return (
    <div className="table-responsive">
      <table className={`table ${tabledt}`}>
        <thead>
          <tr>
            <th>Service</th>
            <th>cpu</th>
            <th>mem</th>
            <th>fsm components</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service, index) => (
            <tr key={index} className={evaluateColor(service, erroredservices)}>
              {service.map((obj, index) => (
                <td key={index}>{obj}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ServiceTable;
