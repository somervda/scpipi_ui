import { Component } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { multi } from './data';
import { MatCardModule } from '@angular/material/card';
import { HelperService } from '../services/helper.service';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [NgxChartsModule,MatCardModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent {
  multi: any[] | undefined;
  view: [number,number] = [700, 300];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Population';
  timeline: boolean = true;

  // colorScheme = {
  //   domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  // };

  constructor(private helperService : HelperService) {
    Object.assign(this, { multi });
    helperService.getResult("auto").subscribe((result) => {console.log(result)});
  }

  onSelect(data:any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data:any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data:any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
