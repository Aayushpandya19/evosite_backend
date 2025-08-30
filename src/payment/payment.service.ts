import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { InvoiceService } from '../invoice/invoice.service';
import { InvoiceStatus } from '../common/enums/invoice-status.enum';
import { PaymentStatus } from '../common/enums/payment-status.enum';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private invoiceService: InvoiceService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    // Verify invoice exists
    const invoice = await this.invoiceService.findOne(createPaymentDto.invoiceId);
    
    // Create payment with COMPLETED status
    const payment = this.paymentRepository.create({
      ...createPaymentDto,
      status: PaymentStatus.COMPLETED
    });
    const savedPayment = await this.paymentRepository.save(payment);
    
    // Update invoice status to PAID
      await this.invoiceService.update(invoice.id, { status: InvoiceStatus.PAID });
    
    return savedPayment;
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.find();
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    
    return payment;
  }
}