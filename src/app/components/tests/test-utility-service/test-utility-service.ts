import { Component, ChangeDetectorRef } from '@angular/core';
import { UtilityService } from '../../../services/utility-service';

@Component({
  selector: 'app-test-utility-service',
  imports: [],
  providers: [UtilityService],
  templateUrl: './test-utility-service.html',
  styleUrl: './test-utility-service.css',
})
export class TestUtilityService {

  test_output: string[] = [];

  constructor(private utilityService: UtilityService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.testMaskAccountNumber();
    this.testFormatSortCode();
    this.testToTime();
    this.testFormatAccountNumber();
    this.testNumbersOnly();
    this.testGetCategoryMeta();
    this.testCheckSavingsProgress();
    this.testGetTransactionDate();
    this.testGetTransactionTime();
  }

  private testMaskAccountNumber() {
    const accountNumber = '12345678';
    const masked = this.utilityService.maskAccountNumber(accountNumber);
    if (masked === '•••• •••• •••• 5678')
      this.test_output.push("Mask account number... PASS");
    else
      this.test_output.push("Mask account number... FAIL");
    this.cdr.detectChanges();
  }

  private testFormatSortCode() {
    const sortCode = '123456';
    const formatted = this.utilityService.formatSortCode(sortCode);
    if (formatted === '12-34-56')
      this.test_output.push("Format sort code... PASS");
    else
      this.test_output.push("Format sort code... FAIL");
    this.cdr.detectChanges();
  }

  private testToTime() {
    const dateString = '2024-01-01T12:34:56';
    const time = this.utilityService.toTime(dateString);
    const expected = new Date(dateString).getTime();
    if (time === expected)
      this.test_output.push("Convert to time... PASS");
    else
      this.test_output.push("Convert to time... FAIL");
    this.cdr.detectChanges();
  }

  private testFormatAccountNumber() {
    const accountNumber = '1234567890123456';
    const formatted = this.utilityService.formatAccountNumber(accountNumber);
    if (formatted === '1234 5678 9012 3456')
      this.test_output.push("Format account number... PASS");
    else
      this.test_output.push("Format account number... FAIL");
    this.cdr.detectChanges();
  }

  private testNumbersOnly() {
    const event = new KeyboardEvent('keydown', { key: 'a' });
    let prevented = false;
    event.preventDefault = () => { prevented = true; };
    this.utilityService.numbersOnly(event);
    if (prevented)
      this.test_output.push("Numbers only input... PASS");
    else
      this.test_output.push("Numbers only input... FAIL");
    this.cdr.detectChanges();
  }

  private testGetCategoryMeta() {
    const category = 'Dining';
    const meta = this.utilityService.getCategoryMeta(category);
    if (meta.icon === 'fa-utensils')
      this.test_output.push("Get category meta... PASS");
    else
      this.test_output.push("Get category meta... FAIL");
    this.cdr.detectChanges();
  }

  private testCheckSavingsProgress() {
    const account = {
      _id: 'test-account',
      balance: 500,
      budget: { amount: 1000 }
    };
    localStorage.removeItem('milestones_test-account');
    localStorage.setItem('milestones_test-account', JSON.stringify([25, 50]));
    let milestone = this.utilityService.checkSavingsProgress(account);
    if (milestone === undefined) {
      this.test_output.push("Check savings progress... PASS");
    } else {
      this.test_output.push(`Check savings progress... FAIL (got '${milestone}')`);
    }
    this.cdr.detectChanges();
  }

  private testGetTransactionDate() {
    const dateString = '2024-01-01T12:34:56Z';
    const formatted = this.utilityService.getTransactionDate(dateString);
    if (formatted === '1st January 2024')
      this.test_output.push("Get transaction date... PASS");
    else
      this.test_output.push("Get transaction date... FAIL");
    this.cdr.detectChanges();
  }

  private testGetTransactionTime() {
    const dateString = '2024-01-01T12:34:56Z';
    const formatted = this.utilityService.getTransactionTime(dateString);
    const expected = '12:34 PM';
    const normalize = (str: string) => str.trim().replace(/\s+/g, ' ').toUpperCase();
    if (normalize(formatted) === normalize(expected)) {
      this.test_output.push("Get transaction time... PASS");
    } else {
      this.test_output.push(`Get transaction time... FAIL (got '${formatted}')`);
    }
    this.cdr.detectChanges();
  }

}
