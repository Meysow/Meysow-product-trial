import { CommonModule } from "@angular/common";
import { Component, signal } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { MessageModule } from "primeng/message";

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    MessageModule,
  ],
})
export class ContactComponent {
  contactForm: FormGroup;
  successMessage = signal<string>("");

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      message: ["", [Validators.required, Validators.maxLength(300)]],
    });
  }

  public onSendMessage() {
    if (this.contactForm.valid) {
      this.successMessage.set("📨 Demande de contact envoyée avec succès !");
      this.contactForm.reset();
    }
  }
}
