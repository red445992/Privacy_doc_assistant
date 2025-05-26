from django.contrib.auth.views import LoginView, LogoutView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import CreateView, UpdateView
from django.urls import reverse_lazy
from django.contrib import messages
from .forms import CustomUserCreationForm, CustomUserChangeForm


class CustomLoginView(LoginView):
    template_name = 'users/login.html'
    redirect_authenticated_user = True

    def form_valid(self, form):
        messages.success(self.request, 'Successfully logged in.')
        return super().form_valid(form)


class CustomLogoutView(LogoutView):
    next_page = 'users:login'

    def dispatch(self, request, *args, **kwargs):
        messages.success(request, 'Successfully logged out.')
        return super().dispatch(request, *args, **kwargs)


class SignUpView(CreateView):
    form_class = CustomUserCreationForm
    template_name = 'users/signup.html'
    success_url = reverse_lazy('users:login')

    def form_valid(self, form):
        messages.success(self.request, 'Account created successfully. Please log in.')
        return super().form_valid(form)


class ProfileUpdateView(LoginRequiredMixin, UpdateView):
    form_class = CustomUserChangeForm
    template_name = 'users/profile.html'
    success_url = reverse_lazy('users:profile')

    def get_object(self, queryset=None):
        return self.request.user

    def form_valid(self, form):
        messages.success(self.request, 'Profile updated successfully.')
        return super().form_valid(form) 