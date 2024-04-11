import { Component, OnDestroy } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { HelperService } from '../services/helper.service';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [
    NgxChartsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
  ],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
})
export class ChartComponent implements OnDestroy {
  multi: any;

  // options
  legend: boolean = false;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Hz';
  timeline: boolean = false;
  view: [number, number] = [800, 400];

  // colorScheme = {
  //   domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  // };

  getResults$$: Subscription | undefined;
  resultName = 'auto';
  resultRows: any;
  resultSeries: string[] = [];
  xAxisName = '';
  yAxisName = '';

  constructor(private helperService: HelperService) {}

  getResults() {
    this.getResults$$ = this.helperService
      .getResult('auto')
      .subscribe((resultRows) => {
        this.resultRows = resultRows;
        this.resultSeries = this.getSeriesNames(this.resultRows);
      });
  }

  getSeriesNames(resultRows: any) {
    let seriesNames: string[] = [];
    if (resultRows.length > 0) {
      let firstRow = resultRows[0];
      for (const item in firstRow) {
        if (firstRow.hasOwnProperty(item)) {
          seriesNames.push(item.toString());
          // console.log(item.toString(), firstRow[item]);
        }
      }
    }
    return seriesNames;
  }

  drawChart() {
    this.multi = this.buildData();
  }

  buildData() {
    // Build data to be used by ngx-chart
    // Just create a simple single series chart

    console.log('build Data');
    let seriesData = [];
    if (this.resultRows.length > 0) {
      for (let i = 0; i < this.resultRows.length; i++) {
        let row = this.resultRows[i];
        let x;
        let y;
        for (const item in row) {
          if (row.hasOwnProperty(item)) {
            // console.log(item.toString(), row[item]);
            if (item.toString() == this.xAxisName) {
              switch (this.xAxisName) {
                case 'timestamp':
                  x = new Date(row[item]);
                  break;
                // case 'frequency':
                //   x = Math.log10(row[item]);
                //   break;
                default:
                  x = row[item];
              }
            }

            if (item.toString() == this.yAxisName) {
              y = row[item];
            }
          }
        }
        let seriesRow = { name: x, value: y };
        seriesData.push(seriesRow);
      }
    }
    let newSeries = [{ name: <string>this.resultName, series: seriesData }];
    this.xAxisLabel = this.xAxisName;
    this.yAxisLabel = this.yAxisName;
    console.log(newSeries);
    return newSeries;
  }

  ngOnDestroy(): void {
    if (this.getResults$$) {
      this.getResults$$.unsubscribe();
    }
  }
}
